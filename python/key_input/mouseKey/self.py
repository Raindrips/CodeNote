import pyautogui
import threading
import pydirectinput
import time
import random
from pynput import mouse, keyboard


class ClickAuto:
    is_press = False
    is_end = False

    def __init__(self):
        self.is_press = False

    def on_click(self, x, y, button, pressed):
        # print("press", button, pressed)
        if button == mouse.Button.x2 and pressed:
            if(not self.is_press):
                print('start loop')
            self.is_press = True
        elif button == mouse.Button.x1 and pressed:
             if(self.is_press):
                print('stop loop')
                self.is_press = False

    def on_press(self, key: keyboard.Key):
        if key == keyboard.Key.f8:
            print(key)
            self.is_end = True
            self.is_press = False

    def repeat(self):
        while not self.is_end:
            if self.is_press:
                # pyautogui.click()
                # pydirectinput.click(_pause=False)
                r = random.uniform(0.05, 0.1)
                pydirectinput.mouseDown(_pause=False) 
                time.sleep(r)
                pydirectinput.mouseUp(_pause=False)

            random_number = random.uniform(0.05, 0.1)
            time.sleep(random_number)


click = ClickAuto()

listener = mouse.Listener(on_click=click.on_click)
listener.start()

listener2 = keyboard.Listener(on_press=click.on_press)

thread = threading.Thread(target=click.repeat)
thread.start()

thread.join()
