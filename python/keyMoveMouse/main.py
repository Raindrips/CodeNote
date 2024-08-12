import pyautogui
import time
import keyboard

def test1():
  # 获取屏幕宽度高度
  width, height = pyautogui.size()
  print(width,height)


  # 获取当前位置坐标
  x, y = pyautogui.position() 
  print(x,y)

    #移动坐标
  pyautogui.move(0, 0)
  pyautogui.moveTo(width / 2, height / 2)

  # 模拟点击 
  pyautogui.click(x,y) 
  # 模拟按键回车键
  pyautogui.press('enter')

x=0
y=0

def update():
  x, y = pyautogui.position() 
  print(x,y)
  keyboard.add_hotkey('f1', test_a)
  
def test2():
  while 1==1:
    update()
    time.sleep(0.02)

def test3():
  while 1==1:
    if keyboard.is_pressed('enter'):
      print('true')
    else:
      print('false')
    time.sleep(1)


def main():
  test3()

main()