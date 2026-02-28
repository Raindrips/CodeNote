import threading
import queue
import time

# 生产者
def producer(q:queue.Queue):
    for i in range(5):
        time.sleep(1)
        item = f"产品-{i}"
        print(f"生产者生产: {item}")
        q.put(item)

# 消费者
def consumer(q:queue.Queue):
    while True:
        item = q.get()
        if item is None:  # 结束信号
            break
        print(f"消费者消费: {item}")
        q.task_done()

# 创建队列和线程
q = queue.Queue()
t1 = threading.Thread(target=producer, args=(q,))
t2 = threading.Thread(target=consumer, args=(q,))

t1.start()
t2.start()

# 等待生产者完成，然后发送结束信号
t1.join()
q.put(None)  # 通知消费者结束
t2.join()
