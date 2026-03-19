import threading

# 共享资源
counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100000):
        ## 无锁情况
        # counter += 1
        with lock:  # 获取锁
            counter += 1
     

# 创建线程
threads = []
for i in range(5):
    t = threading.Thread(target=increment, name=f"Thread-{i}")
    threads.append(t)
    t.start()

# 等待所有线程完成
for t in threads:
    t.join()

print(f"最终计数: {counter}")