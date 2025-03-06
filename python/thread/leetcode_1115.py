import functools
import threading


class FooBar:
    def __init__(self, n):
        self.n = n
        self.job1 = threading.Lock()
        self.job2 = threading.Lock()
        self.job2.acquire()

    def foo(self, printFoo: "Callable[[], None]") -> None:

        for i in range(self.n):
            self.job1.acquire()
            printFoo()
            self.job2.release()

    def bar(self, printBar: "Callable[[], None]") -> None:

        for i in range(self.n):

            self.job2.acquire()
            printBar()
            self.job1.release()



foo = FooBar(2)

fn1 = functools.partial(foo.foo, lambda: print("foo",end=' '))
fn2 = functools.partial(foo.bar, lambda: print("bar",end=' '))

t1 = threading.Thread(target=fn1, name="foo")
t2 = threading.Thread(target=fn2, name="bar")

t1.daemon = True
t2.daemon = True

t1.start()
t2.start()


t1.join()
t2.join()
