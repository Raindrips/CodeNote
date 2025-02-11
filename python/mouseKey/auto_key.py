import pyautogui
import threading
import pydirectinput
import time
import random
from pynput import mouse, keyboard


class ClickAuto:
    is_press = False  # 是否按下
    is_end = False  # 是否结束
    last_key = ""

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
        if key == keyboard.Key.esc:
            print("stop")
            self.is_end = True
            self.is_press = False

        if key == keyboard.KeyCode.from_char("j"):
            self.is_press = True

    def on_release(self, key: keyboard.Key):
        if key == keyboard.KeyCode.from_char("j"):
            self.is_press = False

    def repeat(self):
        while not self.is_end:
            if self.is_press:
                # pyautogui.click()
                # pydirectinput.click(_pause=False)

                # pydirectinput.mouseDown(_pause=False)
                # pydirectinput.mouseUp(_pause=False)
                r = random.uniform(0.05, 0.1)
                print("J")
                pydirectinput.keyDown('j',_pause=False)
                time.sleep(r)
                pydirectinput.keyUp('j',_pause=False)

            random_number = random.uniform(0.05, 0.1)
            time.sleep(random_number)


def main():

    click = ClickAuto()

    # listener = mouse.Listener(on_click=click.on_click)
    # listener.start()

    listener2 = keyboard.Listener(on_press=click.on_press, on_release=click.on_release)
    listener2.start()

    thread = threading.Thread(target=click.repeat)
    thread.start()

    thread.join()

    # if __name__ == "__main__":


main()
