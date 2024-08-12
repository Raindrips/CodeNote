import pyautogui
import threading
import time
from pynput import mouse

class KeyPresser:
    def __init__(self):
        self.pressing = False
        self.interval = 0.1  # 默认连发间隔时间为 0.1 秒
        self.thread = None
        self.key = 'a'  # 默认连发键位为 'a'

    def start_pressing(self):
        if not self.pressing:
            self.pressing = True
            self.thread = threading.Thread(target=self._press_key)
            self.thread.start()

    def stop_pressing(self):
        self.pressing = False
        if self.thread is not None:
            self.thread.join()

    def set_interval(self, interval: float):
        self.interval = interval

    def set_key(self, key: str):
        self.key = key

    def _press_key(self):
        while self.pressing:
            # pyautogui.press(self.key)
            pyautogui.click()
            time.sleep(self.interval)

def on_click(x, y, button, pressed):
    if button == mouse.Button.left:
        if pressed:
            key_presser.start_pressing()
        else:
            key_presser.stop_pressing()

if __name__ == "__main__":
    key_presser = KeyPresser()

    # 示例用法
    key_presser.set_interval(0.2)  # 设置连发间隔为 0.2 秒
    key_presser.set_key('a')       # 设置连发键位为 'a'

    # 监听鼠标事件
    listener = mouse.Listener(on_click=on_click)
    listener.start()
    listener.join()