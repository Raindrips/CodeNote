import functools
import threading


# 交替运行两个函数
class FooBar:
    def __init__(self, n):
        self.n = n
        self.jobZero = threading.Lock()
        self.jobEven = threading.Lock()
        self.jobOdd = threading.Lock()

        # self.jobOdd.acquire()
        # self.jobEven.acquire()

    # 0
    def zero(self, printNumber: "Callable[[int], None]") -> None:

        for i in range(self.n):
            printNumber(i)
            if i % 2 == 0:
                self.jobOdd.release()
            else:
                self.jobEven.release()

    # 2
    def even(self, printNumber: "Callable[[int], None]") -> None:

        for i in range(self.n):
            if i % 2 == 1:
                continue
            self.jobEven.acquire()  # 自己阻塞

            self.jobZero.acquire()
            printNumber(i)
            self.jobZero.release()

    # 1
    def odd(self, printNumber: "Callable[[int], None]") -> None:
        for i in range(self.n):
            if i % 2 == 0:
                continue

            self.jobOdd.acquire()  # 自己阻塞

            self.jobZero.acquire()
            printNumber(i)
            self.jobZero.release()


foo = FooBar(4)

fn = functools.partial(foo.zero, lambda x: print(x, end=" "))

t1 = threading.Thread(target=fn, name="zero")
t2 = threading.Thread(target=fn, name="even")
t3 = threading.Thread(target=fn, name="odd")


# t1.daemon = True
# t2.daemon = True

t1.start()
t2.start()
t3.start()

t1.join()
t2.join()
t3.join()
