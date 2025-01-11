import time
from pynput import keyboard, mouse
import threading

# 用于存储操作记录的列表
events = []

# 用于控制记录的状态
is_recording = False

def on_press(key):
    global events
    try:
        events.append(('key_press', key.char, time.time()))
    except AttributeError:
        # 捕获功能键（如Ctrl、Alt等）
        events.append(('key_press', str(key), time.time()))

def on_release(key):
    global events
    events.append(('key_release', key, time.time()))
    if key == keyboard.Key.esc:
        # 按下 ESC 键停止记录
        return False

def on_click(x, y, button, pressed):
    global events
    event_type = 'mouse_press' if pressed else 'mouse_release'
    events.append((event_type, x, y, button.name, time.time()))

def on_move(x, y):
    global events
    events.append(('mouse_move', x, y, time.time()))

def record_operations():
    global is_recording, events
    events.clear()  # 清空之前的记录
    is_recording = True
    # 启动键盘监听
    with keyboard.Listener(on_press=on_press, on_release=on_release) as keyboard_listener:
        # 启动鼠标监听
        with mouse.Listener(on_click=on_click, on_move=on_move) as mouse_listener:
            print("Recording... Press ESC to stop.")
            keyboard_listener.join()
            mouse_listener.join()

def replay_operations():
    global events
    if not events:
        print("No events recorded to replay.")
        return

    print("Replaying events...")
    start_time = events[0][2]  # 第一个事件的时间戳
    for event in events:
        event_type = event[0]
        timestamp = event[2]
        delay = timestamp - start_time  # 计算相对时间

        time.sleep(delay)  # 按照事件的间隔重播

        if event_type == 'key_press':
            key = event[1]
            try:
                # 使用 pynput 来按下键
                controller = keyboard.Controller()
                controller.press(key)
            except AttributeError:
                # 功能键（如 Shift, Esc 等）
                controller.press(keyboard.Key[key])
        elif event_type == 'key_release':
            key = event[1]
            try:
                controller = keyboard.Controller()
                controller.release(key)
            except AttributeError:
                controller.release(keyboard.Key[key])
        elif event_type == 'mouse_press' or event_type == 'mouse_release':
            x, y, button, _ = event[1], event[2], event[3], event[4]
            mouse_controller = mouse.Controller()
            button = getattr(mouse.Button, button)  # 获取按钮对象
            if event_type == 'mouse_press':
                mouse_controller.press(button)
            else:
                mouse_controller.release(button)
        elif event_type == 'mouse_move':
            x, y = event[1], event[2]
            mouse_controller = mouse.Controller()
            mouse_controller.position = (x, y)

    print("Replay finished.")

def start_recording():
    print("Press ESC to stop recording.")
    record_operations()

def start_replaying():
    replay_operations()

if __name__ == "__main__":
    # 启动一个线程来执行录制操作
    recording_thread = threading.Thread(target=start_recording)
    recording_thread.start()
    recording_thread.join()

    # 重播操作
    start_replaying()
