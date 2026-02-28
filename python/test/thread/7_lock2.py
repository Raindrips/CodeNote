import threading
import time


# 可重入互斥,用于递归函数嵌套资源访问
def fn1():
    #
    r_lock = threading.RLock()

    def worker():
        with r_lock:
            print("第一次获取锁")
            with r_lock:  # 重入
                print("第二次获取锁")
                r_lock.acquire()
                print("第三次获取锁")
                r_lock.release()

    t = threading.Thread(target=worker)
    t.start()
    t.join()


def fn2():
    event = threading.Event()

    def waiter():
        print("等待事件")
        event.wait()  # 阻塞直到事件发生
        print("事件发生，继续执行")

    def signaler():
        time.sleep(1)
        print("触发事件")
        event.set()

    t1 = threading.Thread(target=waiter)
    t2 = threading.Thread(target=signaler)
    t1.start()
    t2.start()
    t1.join()
    t2.join()


# 条件变量
def fn3():
    condition = threading.Condition()
    data = "None"

    def producer():
        global data
        with condition:
            time.sleep(1)
            data = "产品"
            print("生产者生产完成")
            condition.notify()  # 通知消费者

    def consumer():
        global data
        with condition:
            print("消费者等待")
            condition.wait()  # 等待生产者通知
            print(f"消费者收到: {data}")

    t1 = threading.Thread(target=producer)
    t2 = threading.Thread(target=consumer)
    t2.start()
    t1.start()
    t1.join()
    t2.join()


def fn4():

    semaphore = threading.Semaphore(2)  # 最多 2 个线程同时运行

    def worker(n):
        with semaphore:
            print(f"Worker {n} 开始")
            time.sleep(1)
            print(f"Worker {n} 结束")

    threads = [threading.Thread(target=worker, args=(i,)) for i in range(6)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()


def fn5():
    barrier = threading.Barrier(3)  # 等待 3 个线程

    def worker(n):
        print(f"Worker {n} 准备")
        barrier.wait()  # 等待所有线程到达
        print(f"Worker {n} 通过屏障")

    threads = [threading.Thread(target=worker, args=(i,)) for i in range(3)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()


def main():
    fn5()


if __name__ == "__main__":
    main()
