import pyautogui
import threading
import time

class MouseClicker:
    def __init__(self):
        self.clicking = False
        self.interval = 0.1  # 默认间隔时间为 0.1 秒
        self.thread = None

    def start_clicking(self):
        self.clicking = True
        self.thread = threading.Thread(target=self._click_mouse)
        self.thread.start()

    def stop_clicking(self):
        self.clicking = False
        if self.thread is not None:
            self.thread.join()

    def set_interval(self, interval: float):
        self.interval = interval

    def _click_mouse(self):
        while self.clicking:
            pyautogui.click()
            time.sleep(self.interval)

    def auto_click(self, duration: float):
        end_time = time.time() + duration
        while time.time() < end_time:
            pyautogui.click()
            time.sleep(self.interval)

if __name__ == "__main__":
    clicker = MouseClicker()

    # 示例用法
    clicker.set_interval(0.2)  # 设置连发间隔为 0.2 秒
    clicker.start_clicking()   # 开始连发

    # 运行 5 秒后停止连发
    time.sleep(5)
    clicker.stop_clicking()

    # 自动点击 3 秒
    clicker.auto_click(3)