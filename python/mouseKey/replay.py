import time
from pynput import mouse, keyboard

def replay_from_file(filename):
    with open(filename, 'r') as f:
        for line in f:
            if 'Mouse move to' in line:
                _, x, y = line.split('(')[-1].split(')')[0].split(',')
                x, y = int(x), int(y)
                mouse.Controller().position = (x, y)
            elif 'Mouse pressed at' in line:
                _, x, y = line.split('at')[-1].split('with')[0].split(',')
                x, y = int(x), int(y)
                mouse.Button.left, mouse.Button.right = line.split('with')[1].split()[1], line.split('with')[1].split()[2]
                mouse.Controller().click(mouse.Button(left if 'left' in line else right), 1)
            elif 'Mouse released at' in line:
                pass  # 可以根据需要添加释放鼠标按钮的代码
            elif 'Mouse scrolled' in line:
                _, x, y, dx, dy = line.split()
                dx, dy = int(dx.split('=')[1]), int(dy.split('=')[1])
                mouse.Controller().scroll(dx, dy)
            elif 'Key pressed' in line:
                key = line.split(' ')[-1].strip()
                keyboard.Controller().press(key)
            elif 'Key released' in line:
                key = line.split(' ')[-1].strip()
                keyboard.Controller().release(key)

# 复现鼠标操作
replay_from_file('mouse_log.txt')

# 复现键盘操作
replay_from_file('keyboard_log.txt')