import threading
import time

def worker():
    print(f"线程 {threading.current_thread().name} 开始运行")
    time.sleep(2)  # 模拟耗时任务
    print(f"线程 {threading.current_thread().name} 结束运行")

# 创建线程
t = threading.Thread(target=worker, name="Worker-1")

# 启动线程
t.start()

# 主线程等待子线程结束
t.join()

print("主线程结束")