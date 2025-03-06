import threading


# 按顺序输出
class Foo(object):
    def __init__(self):

        self.job1 = threading.Lock()
        self.job2 = threading.Lock()
        self.job1.acquire()
        self.job2.acquire()

    def first(self, printFirst: "Callable[[], None]") -> None:

        printFirst()
        self.job1.release()

    def second(self, printSecond: "Callable[[], None]") -> None:

        with self.job1:
            printSecond()
            self.job2.release()

    def third(self, printThird: "Callable[[], None]") -> None:
        with self.job2:
            printThird()


foo = Foo()

def first(): print('1')
def second(): print('2')
def third(): print('3')

foo.first(first)
foo.second(second)
foo.third(third)
