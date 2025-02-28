import pyautogui
import time

def auto_click(interval=0.1):
    """
    自动点击鼠标左键
    :param interval: 点击间隔时间（秒）
    """
    while True:
        pyautogui.click()  # 模拟鼠标左键点击
        time.sleep(interval)  # 等待指定时间后再次点击

if __name__ == "__main__":
    print("按下 Ctrl + C 来停止连发工具")
    try:
        auto_click()  # 调用自动点击函数
    except KeyboardInterrupt:
        print("连发工具已停止") 