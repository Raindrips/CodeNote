from pynput import mouse, keyboard
import json


def on_move(x, y):
    pass
    # with open("mouse_log.txt", "a") as f:
    #     f.write(f"Mouse move to ({x}, {y})\n")


def on_click(x, y, button, pressed):
    with open("mouse_log.txt", "a") as f:
        action = "pressed" if pressed else "released"
        f.write(f"Mouse {action} at ({x}, {y}) with {button}\n")


def on_scroll(x, y, dx, dy):
    with open("mouse_log.txt", "a") as f:
        f.write(f"Mouse scrolled at ({x}, {y}) with dx={dx}, dy={dy}\n")


def on_press(key):
    if key == keyboard.Key.esc:
        exit()
        return False  # 停止监听
    with open("keyboard_log.txt", "a") as f:
        f.write(f"Key {key} pressed\n")


def on_release(key):
    with open("keyboard_log.txt", "a") as f:
        f.write(f"Key {key} released\n")


# 监听鼠标事件
print('mouse start')
with mouse.Listener(
    on_move=on_move, on_click=on_click, on_scroll=on_scroll
) as listener:
    listener.join()

# 监听键盘事件
print('keyboard start')
with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
