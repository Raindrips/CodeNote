import threading


# 信号量
class H2O:
    def __init__(self):
        self.HSem = threading.Semaphore(2)
        self.OSem = threading.Semaphore(0)

    def hydrogen(self, releaseHydrogen: "Callable[[], None]") -> None:
        # releaseHydrogen() outputs "H". Do not change or remove this line.
        self.HSem.acquire(1)
        releaseHydrogen()
        self.OSem.release(1)

    def oxygen(self, releaseOxygen: "Callable[[], None]") -> None:
        # releaseOxygen() outputs "O". Do not change or remove this line.
        self.OSem.acquire(2)
        releaseOxygen()
        self.HSem.release(2)


def test():

    # def H()
    # threading.Thread()
    pass
