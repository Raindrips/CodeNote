import random
import threading
import time

def worker(num):
    print(f"线程 {num} 开始运行")
    time.sleep(1)
    print(f"线程 {num} 结束运行")

# 创建多个线程
threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(i,), name=f"Worker-{i}")
    threads.append(t)
    t.start()

# 等待所有线程结束
for t in threads:
    t.join()

print("所有线程结束")