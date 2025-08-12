# for else：找出第一个能被 7 整除的数，没找到则打印 "not found"。
import re
from traceback import print_tb
from typing import Callable
import time
from unittest import result


def fn_1():
    n = 10
    for x in range(1, n):
        if x % 7 == 0:
            print(x)
            break
    else:
        print("not found")


# try except else finally：正确捕获除零错误。
def fn_2():
    a, b = 10, 0
    try:
        c = a / b
    except ZeroDivisionError:
        print("ZeroDivisionError")
    except:
        print("DK error")
    else:
        print("no error")
    finally:
        print("end")


# lambda：写一个 lambda 实现 x**2。
def fn_3():
    fn: Callable
    fn = lambda x: x**2
    print(fn(10))
    fn = lambda a, b: a + b

    local = "local"

    def localFn():
        print("hello", local)

    fn = localFn
    fn()


# map 与 filter：平方列表中大于 5 的数。
def fn_4():
    nums = [1, 2, 3, 4]
    map_sqa = map(lambda x: x**2, nums)
    res = list(filter(lambda x: x > 5, map_sqa))
    print(res)


# 装饰器：写一个简单的装饰器统计函数执行时间。
def func_timer(func: Callable):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print("Time:", time.time() - start)
        return result

    return wrapper


# with 语句：用 with open() 读取文件内容。
def fn_5():
    with open("test.txt", "r", encoding="utf-8") as f:
        content = f.read()

    # 路径操作：用 os 获取当前文件的绝对路径。
    import os

    print(os.path.abspath(__file__))

    # 模块导入：从 math 导入 sqrt 并计算平方根。
    from math import sqrt

    print(sqrt(16))

    # 数据解构：交换字典的 key 和 value。

    d = {"a": 1, "b": 2}
    inv = {v: k for k, v in d.items()}


def fn_6():
    # 一行求和：用一行代码求 1 到 100 的和。
    print(sum(range(1, 101)))


def main():
    fn_1()
    fn_2()
    fn_3()
    fn_4()
    fn_5()
    fn_6()
    # fn_7()


if __name__ == "__main__":
    main()
