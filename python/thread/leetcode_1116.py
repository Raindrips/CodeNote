import functools
import threading


# 交替运行两个函数
class ZeroEvenOdd:
    def __init__(self, n):
        self.n = n

        self.event_a1 = threading.Event()
        self.event_b = threading.Event()  # B 的执行
        self.event_a2 = threading.Event()  # A 的第二次执行
        self.event_c = threading.Event()  # C 的执行
        
        
        self.event_a1.set()


    # 0
    def zero(self, printNumber: "Callable[[int], None]") -> None:
        for i in range(self.n):

            if i % 2 == 0:
                # 偶数等待
                self.event_a1.wait()
                self.event_a1.clear()
                printNumber(0)
                self.event_c.set()
            else:
                # 奇数等待
                self.event_a2.wait()
                self.event_a2.clear()
                printNumber(0)
                self.event_b.set()

    # 2
    def even(self, printNumber: "Callable[[int], None]") -> None:
        for i in range(self.n):
            step = i + 1
            if step % 2 == 1:
                continue

            self.event_b.wait()
            self.event_b.clear()
            printNumber(step)
            self.event_a1.set()

    # 1
    def odd(self, printNumber: "Callable[[int], None]") -> None:
        for i in range(self.n):
            step = i + 1
            if step % 2 == 0:
                continue

            self.event_c.wait()
            self.event_c.clear()
            printNumber(step)
            self.event_a2.set()


foo = ZeroEvenOdd(4)

fnZero = functools.partial(foo.zero, lambda x: print(x, end=" "))
fnEven = functools.partial(foo.even, lambda x: print(x, end=" "))
fnOdd = functools.partial(foo.odd, lambda x: print(x, end=" "))


t1 = threading.Thread(target=fnZero, name="zero")
t2 = threading.Thread(target=fnEven, name="even")
t3 = threading.Thread(target=fnOdd, name="odd")


# t1.daemon = True
# t2.daemon = True

t1.start()
t2.start()
t3.start()


t1.join()
t2.join()
t3.join()
