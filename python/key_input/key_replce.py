"""
监听指定按键并触发动作（单次触发）。

默认：监听 `space`，触发鼠标向下滚轮一次；按 `Esc` 退出。

提供两个动作类：`ScrollAction`（鼠标滚轮）和 `KeyAction`（模拟按键）。
配置通过在脚本中创建监听器时传入参数。
"""

from typing import Union
from pynput import keyboard
from pynput.keyboard import Key, Controller as KeyboardController
from pynput.mouse import Controller as MouseController


class ScrollAction:
    """鼠标滚轮动作。amount 为整数，正值向上，负值向下。"""

    def __init__(self, amount: int = -2):
        self.amount = amount
        self._mouse = MouseController()

    def trigger(self):
        # 水平滚动 dx=0, 垂直滚动 dy=self.amount
        self._mouse.scroll(0, self.amount)


class KeyAction:
    """模拟按键动作。按键可以是单字符或 `pynput.keyboard.Key` 的名称。"""

    def __init__(self, key: Union[str, Key]):
        self._kc = KeyboardController()
        if isinstance(key, str):
            # 支持像 'a' 或 'space' 这样的字符串
            self.key = self._parse_key_name(key)
        else:
            self.key = key

    def _parse_key_name(self, name: str):
        name = name.lower()
        if name == "space":
            return Key.space
        if name == "esc" or name == "escape":
            return Key.esc
        if len(name) == 1:
            return name
        # fallback: try attribute on Key
        return getattr(Key, name, name)

    def trigger(self):
        self._kc.press(self.key)
        self._kc.release(self.key)


class KeyListener:
    """监听按键并触发指定动作（单次触发）。按 Esc 退出并释放资源。"""

    def __init__(self, listen_key: str = "space", action=None):
        self.listen_key_name = listen_key
        self.listen_key = self._parse_listen_key(listen_key)
        self.action = action or ScrollAction(-2)
        self._listener = None

    def _parse_listen_key(self, name: str):
        name = name.lower()
        if name == "space":
            return Key.space
        if name == "esc" or name == "escape":
            return Key.esc
        if len(name) == 1:
            return name
        return getattr(Key, name, name)

    def _on_press(self, key):
        try:
            if key == self.listen_key or getattr(key, "char", None) == self.listen_key:
                # 单次触发
                if self.action:
                    self.action.trigger()
        except Exception:
            pass

    def _on_release(self, key):
        # 按 Esc 停止监听并退出
        if key == Key.f10:
            return False

    def start(self):
        self._listener = keyboard.Listener(
            on_press=self._on_press, on_release=self._on_release
        )
        self._listener.start()
        self._listener.join()


if __name__ == "__main__":   
    # 示例：监听空格，触发向下滚轮 3 格
    listener = KeyListener(listen_key="space", action=ScrollAction(amount=-3))
    print("启动监听：按 Space 触发向下滚动一次；按 Esc 退出。")
    try:
        listener.start()
    except KeyboardInterrupt:
        pass
  