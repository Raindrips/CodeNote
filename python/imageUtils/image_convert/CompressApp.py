import math
import threading
import tkinter as tk
from tkinter import ttk, filedialog

import main_press


class CompressApp:
    input = ""
    output = ""

    def __init__(self, root):

        self.init_UI(root)

    def init_UI(self, root):
        self.root = root
        self.root.title("图片压缩工具")
        self.root.geometry("480x360")
        self.root.resizable(False, False)

        # 应用现代简约风格的 ttk 主题
        style = ttk.Style(self.root)
        style.theme_use("clam")  # 可选 'clam', 'alt', 'default', 'classic'

        # 容器
        frame = ttk.Frame(self.root, padding=10)
        frame.pack(fill=tk.BOTH, expand=True)

        # 按钮：打开对话框
        self.btn_open = ttk.Button(
            frame, text="选择输入文件夹", command=self.open_folder
        )
        self.btn_open.pack(pady=(0, 10))

        # 只读文本框：显示并复制路径
        self.folder_path = tk.StringVar()
        entry = ttk.Entry(
            frame, textvariable=self.folder_path, state="readonly", width=50
        )
        entry.pack()

        self.btn_open_out = ttk.Button(
            frame, text="选择输出文件夹", command=self.open_folder_out
        )
        self.btn_open_out.pack(pady=(0, 10))

        self.folder_path2 = tk.StringVar()
        entry = ttk.Entry(
            frame, textvariable=self.folder_path2, state="readonly", width=50
        )
        entry.pack()

        ttk.Label(frame, text="压缩后质量： (1-100)").pack(pady=(10, 0))

        self.quality = tk.IntVar(value=80)
        input_entry = ttk.Entry(frame, textvariable=self.quality, width=10)
        input_entry.pack(pady=(0, 10))
        input_entry.bind("<FocusOut>", lambda event: self._update_quality(input_entry))

        self.btn_start = ttk.Button(
            frame, text="开始处理", command=self.start_processing
        )
        self.btn_start.pack(pady=(10, 0))

        # 状态提示
        self.status_var = tk.StringVar(value="准备就绪")
        self.status_label = ttk.Label(
            frame, textvariable=self.status_var, foreground="#333"
        )
        self.status_label.pack(pady=(10, 0))

    def open_folder(self):
        # 打开文件夹选择对话框
        folder_selected = filedialog.askdirectory(title="请选择文件夹")
        if folder_selected:
            # 保存并在只读文本框中显示
            self.input = folder_selected
            self.folder_path.set(folder_selected)

    def open_folder_out(self):

        folder_selected = filedialog.askdirectory(title="请选择文件夹")
        if folder_selected:
            self.output = folder_selected
            self.folder_path2.set(folder_selected)

    def start_processing(self):
        # 这里可以添加处理逻辑，例如调用其他函数或脚本
        if self.input and self.output:
            quality = int(max(0, min(100, self.quality.get())))

            self._set_status(f"开始处理：{self.input} -> {self.output} 质量={quality}")
            self._set_buttons_state("disabled")

            thread = threading.Thread(
                target=self._run_press, args=(quality,), daemon=True
            )
            thread.start()
        else:
            self._set_status("请确保选择了输入和输出文件夹")

    def _run_press(self, quality: int):

        try:
            self.root.after(0, lambda: self._set_status("正在压缩中"))
            main_press.start_press(self.input, self.output, quality)
            self.root.after(0, lambda: self._set_status("处理完成,请检查文件"))
        except Exception as e:
            self.root.after(0, lambda: self._set_status(f"处理失败: {e}"))
        finally:
            self.root.after(0, lambda: self._set_buttons_state("normal"))

    def _update_quality(self, entry):
        try:
            val = max(1, min(100, int(entry.get())))
            self.quality.set(val)
            self._set_status("设置成功")
        except ValueError:
            self._set_status("请输入有效的数字")

    def _set_buttons_state(self, state: str):
        self.btn_open.configure(state=state)
        self.btn_open_out.configure(state=state)
        self.btn_start.configure(state=state)

    def _set_status(self, text: str):
        self.status_var.set(text)


if __name__ == "__main__":
    root = tk.Tk()
    app = CompressApp(root)
    root.mainloop()
