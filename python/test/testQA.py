# 1.变量交换：交换两个变量 a 和 b 的值（不使用第三个变量）。
def fn_1():
    a = 1
    b = 2
    print(a, b)
    a, b = b, a
    print(a, b)


# 链式比较：判断 10 < x < 20 的写法。
def fn_2():
    x = 5
    print(10 < x < 20)


# 3.多变量赋值：将 1, 2, 3 赋值给 a, b, c。
def fn_3():
    a, b, c = 1, 2, 3
    print(a, b, c)


# 4. 解构赋值：从列表 [1, 2, 3, 4, 5] 取出第一个和最后一个值，忽略中间。
def fn_4():
    list = [1, 2, 3, 4, 5]
    a, b = list[0], list[-1]
    print(a, b)


# 5. 三元运算符：将 result 设为 "yes" 如果 x > 10 否则 "no"。
def fn_5():
    x = 15
    result = "yes" if x > 10 else "no"
    print(result)


# 空值判断：判断变量是否为 None。
def fn_6():
    a = None
    b = 1
    if a is None:
        print("a is None")
    if b is not None:
        print("b is not None")


def fn_7():
    a = True + True  # True=1,False=0
    b = True + False
    print(a, b)


def fn_8():
    a = [] is []  # 判断两个列表是否是同一个对象
    b = [] == []  # 判断两个列表的值是否相等
    l1 = []
    l2 = []
    l3 = l1
    print(a, b, l1 is l2, l1 is l3)


def append_item(item, list=[]):
    if list is None:
        list = []
    list.append(item)
    print(item, list)


# 10
def add(x: int, y: int) -> int:
    return x + y


def fn_9():
    append_item(1, None)


def main():
    fn_1()
    fn_2()
    fn_3()
    fn_4()
    fn_5()
    fn_6()
    fn_7()
    fn_8()
    fn_9()


if __name__ == "__main__":
    main()
