import time
import keyboard
import threading
from pynput import keyboard as pynput_keyboard

class KeyPresser:
    def __init__(self, key: str, interval: float = 0.1):
        self.key = key
        self.interval = interval
        self.pressing = False
        self.thread = None

    def start_pressing(self):
        if not self.pressing:
            self.pressing = True
            self.thread = threading.Thread(target=self._press_key)
            self.thread.start()

    def stop_pressing(self):
        self.pressing = False
        if self.thread is not None:
            self.thread.join()

    def _press_key(self):
        while self.pressing:
            keyboard.write(self.key)
            time.sleep(self.interval)

def on_press(key):
    try:
        if key.char == 'a':
            key_presser.start_pressing()
    except AttributeError:
        pass

def on_release(key:pynput_keyboard.Key):
    if key == pynput_keyboard.Key.esc:
        return False
    try:
        if key.char == 'a':
            key_presser.stop_pressing()
        if key.char==pynput_keyboard.Key.esc:
            exit()
    except AttributeError:
        pass

if __name__ == "__main__":
    key_presser = KeyPresser('a', 0.1)  # 设置连发键为 'a'，间隔为 0.1 秒

    # 监听键盘事件
    listener = pynput_keyboard.Listener(on_press=on_press, on_release=on_release)
    listener.start()
    listener.join()