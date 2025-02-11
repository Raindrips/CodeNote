import pyautogui
import threading
import pydirectinput
import time
import random
from pynput import mouse, keyboard


# 9开始  0暂停
# 自动进行按键点击
class ClickAuto:
    is_press = False
    is_end = False

    def __init__(self):
        self.is_press = False

    def on_click(self, x, y, button, pressed):
        # print("press", button, pressed)
        if button == mouse.Button.x2 and pressed:
            if not self.is_press:
                print("start loop")
            self.is_press = True
        elif button == mouse.Button.x1 and pressed:
            if self.is_press:
                print("stop loop")
                self.is_press = False

    def on_press(self, key: keyboard.Key):
        print(type(key), key)
        if key == keyboard.KeyCode.from_char("9"):
            print("open")
            self.is_press = True
        elif key == keyboard.KeyCode.from_char("0"):
            print("pause")
            self.is_press = False
        if key == keyboard.Key.esc:
            self.is_press = False
            self.is_end = True

    def repeat(self):
        while not self.is_end:
            if self.is_press:

                r = random.uniform(0.02, 0.05)
                # pyautogui.click()
                pydirectinput.keyDown(key="u", _pause=False)
                # pydirectinput.mouseDown(_pause=False)
                time.sleep(r)
                pydirectinput.keyUp(key="u", _pause=False)
                # pydirectinput.mouseUp(_pause=False)
            random_number = random.uniform(0.05, 0.08)
            time.sleep(random_number)


click = ClickAuto()

# listener = mouse.Listener(on_click=click.on_click)
# listener.start()

listener2 = keyboard.Listener(on_press=click.on_press)
listener2.start()

thread = threading.Thread(target=click.repeat)
thread.start()

thread.join()

listener2.stop()
