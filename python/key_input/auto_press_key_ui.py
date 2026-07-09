import tkinter as tk
from tkinter import ttk, messagebox
import threading
import time
from pynput import keyboard

class AutoKeyPressApp:
    def __init__(self, root):
        self.root = root
        self.root.title("自动按键工具")
        self.root.geometry("480x340")
        self.root.resizable(False, False)

        # 初始化状态变量
        self.target_key = None
        self.is_running = False
        self.listener = None
        self.worker_thread = None
        # 创建UI组件
        self.create_widgets()

    def create_widgets(self):
        """创建界面元素"""
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # 状态标签
        self.status_label = ttk.Label(main_frame, text="点击下方按钮选择要操作的按键")
        self.status_label.pack(pady=(0, 10))

        # 按键选择按钮
        self.select_key_btn = ttk.Button(main_frame, text="选择按键", command=self.start_key_listener)
        self.select_key_btn.pack(pady=(0, 10))

        # 模式选择框架
        mode_frame = ttk.LabelFrame(main_frame, text="模式", padding="10")
        mode_frame.pack(fill=tk.X, pady=(0, 10))

        self.mode_var = tk.StringVar(value="hold")
        ttk.Radiobutton(mode_frame, text="长按（按住→松开→再按住循环）", variable=self.mode_var, value="hold").pack(anchor=tk.W)
        ttk.Radiobutton(mode_frame, text="连发（反复按下松开）", variable=self.mode_var, value="rapid").pack(anchor=tk.W)

        # 参数设置框架
        param_frame = ttk.Frame(main_frame)
        param_frame.pack(fill=tk.X, pady=(0, 10))

        # 长按时长
        ttk.Label(param_frame, text="长按时长(秒):").pack(side=tk.LEFT)
        self.hold_var = tk.DoubleVar(value=3.0)
        ttk.Spinbox(param_frame, from_=0.5, to=3600, increment=0.5,
                     textvariable=self.hold_var, width=6).pack(side=tk.LEFT, padx=(5, 15))

        # 连发间隔
        ttk.Label(param_frame, text="连发间隔(ms):").pack(side=tk.LEFT)
        self.interval_var = tk.IntVar(value=50)
        ttk.Spinbox(param_frame, from_=10, to=5000,
                     textvariable=self.interval_var, width=6).pack(side=tk.LEFT, padx=(5, 0))

        # 控制按钮框架
        control_frame = ttk.Frame(main_frame)
        control_frame.pack(fill=tk.X)

        self.start_btn = ttk.Button(control_frame, text="开始", command=self.start_pressing, state=tk.DISABLED)
        self.start_btn.pack(side=tk.LEFT, padx=(0, 10))

        self.stop_btn = ttk.Button(control_frame, text="结束", command=self.stop_pressing, state=tk.DISABLED)
        self.stop_btn.pack(side=tk.LEFT)

    def start_key_listener(self):
        """启动按键监听线程"""
        self.status_label.config(text="请按下要操作的按键...")
        self.select_key_btn.config(state=tk.DISABLED)

        listener_thread = threading.Thread(target=self.listen_for_key)
        listener_thread.daemon = True
        listener_thread.start()

    def listen_for_key(self):
        """监听按键输入"""
        try:
            with keyboard.Listener(on_press=self.on_key_press) as listener:
                self.listener = listener
                listener.join()
        except Exception as e:
            print(f"监听出错: {e}")
            self.root.after(0, lambda: self.status_label.config(text="按键选择失败，请重试"))
            self.root.after(0, lambda: self.select_key_btn.config(state=tk.NORMAL))

    def on_key_press(self, key):
        """处理按键事件"""
        try:
            self.target_key = key
            key_name = self.get_key_name(key)

            self.root.after(0, lambda: self.status_label.config(text=f"已选择按键: {key_name}"))
            self.root.after(0, lambda: self.start_btn.config(state=tk.NORMAL))
            self.root.after(0, lambda: self.select_key_btn.config(state=tk.NORMAL))

            if self.listener:
                self.listener.stop()

            return False

        except Exception as e:
            print(f"按键处理出错: {e}")
            self.root.after(0, lambda: self.status_label.config(text="按键选择失败，请重试"))
            self.root.after(0, lambda: self.select_key_btn.config(state=tk.NORMAL))
            if self.listener:
                self.listener.stop()

    def start_pressing(self):
        """启动按键任务"""
        self.is_running = True

        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)
        self.select_key_btn.config(state=tk.DISABLED)

        key_name = self.get_key_name(self.target_key)
        mode_text = "长按" if self.mode_var.get() == "hold" else "连发"
        self.status_label.config(text=f"{mode_text}中: {key_name}")

        self.worker_thread = threading.Thread(target=self.press_key_continuously)
        self.worker_thread.daemon = True
        self.worker_thread.start()

    def stop_pressing(self):
        """停止按键任务"""
        self.is_running = False

    def press_key_continuously(self):
        """持续按压按键"""
        try:
            controller = keyboard.Controller()
            mode = self.mode_var.get()

            if mode == "hold":
                # 长按模式：按住N秒 → 松开 → 再按住，循环
                hold_sec = self.hold_var.get()
                while self.is_running:
                    controller.press(self.target_key)
                    # 分段等待，以便快速响应停止
                    wait_end = time.monotonic() + hold_sec
                    while self.is_running and time.monotonic() < wait_end:
                        time.sleep(0.02)
                    controller.release(self.target_key)
                    # 松开一小段时间，让系统识别为新一次按下
                    if self.is_running:
                        time.sleep(0.05)
            else:
                # 连发模式：反复按下松开
                interval = self.interval_var.get() / 1000.0
                while self.is_running:
                    controller.press(self.target_key)
                    time.sleep(0.02)  # 按下保持20ms
                    controller.release(self.target_key)
                    # 等待间隔（分段检查以便快速响应停止）
                    wait_end = time.monotonic() + interval - 0.02
                    while self.is_running and time.monotonic() < wait_end:
                        time.sleep(0.01)

        except Exception as e:
            print(f"按键控制出错: {e}")
            self.root.after(0, lambda: messagebox.showerror("错误", f"按键控制出错: {str(e)}"))

        finally:
            self.root.after(0, self.on_task_finished)

    def on_task_finished(self):
        """任务完成后的UI更新"""
        key_name = self.get_key_name(self.target_key)
        self.status_label.config(text=f"已停止: {key_name}")

        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)
        self.select_key_btn.config(state=tk.NORMAL)

    def get_key_name(self, key):
        """获取按键的显示名称"""
        if hasattr(key, 'char') and key.char is not None:
            return key.char.upper()
        else:
            return str(key).replace("Key.", "").upper()

    def on_closing(self):
        """窗口关闭前的清理"""
        if self.is_running:
            self.is_running = False
            if self.worker_thread:
                self.worker_thread.join(timeout=1)

        if self.listener and self.listener.running:
            self.listener.stop()

        self.root.destroy()

if __name__ == "__main__":
    try:
        root = tk.Tk()
        app = AutoKeyPressApp(root)
        root.protocol("WM_DELETE_WINDOW", app.on_closing)
        root.mainloop()
    except ImportError:
        print("缺少依赖库，请先安装：")
        print("pip install pynput")
    except Exception as e:
        print(f"程序启动失败: {e}")
