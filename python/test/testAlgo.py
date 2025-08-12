# zip：将 [1, 2, 3] 和 ['a', 'b', 'c']
# 合并成 [(1, 'a'), (2, 'b'), (3, 'c')]。


def fn_1():
    arr = [1, 2, 3]
    arr_2 = ["a", "b", "c"]
    obj = zip(arr, arr_2)
    for val in obj:
        print(val)


# enumerate：遍历列表时获取索引和值。
def fn_2():
    arr = [9, 7, 6, 5, 1]
    for i, x in enumerate(arr):
        print(i, x)


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b


# 生成器：写一个生成斐波那契数列的生成器。
def fn_3():
    arr = [_ for _ in fib(10)]
    print(arr)


# 列表推导式条件过滤：取 [1, 2, 3, 4] 中的偶数平方。
# 字典推导式 生成 {1: 1, 2: 4, 3: 9}
# 集合操作 求 [1, 2, 3] 和 [2, 3, 4] 的交集
# 解包运算符 把 [1, 2, 3] 展开成函数参数
def fn_4():
    even_squares = [x**2 for x in [1, 2, 3, 4] if x % 2 == 0]
    print(even_squares)

    my_dict = {1: 1, 2: 4, 3: 9}
    print(my_dict)

    squares = {x: x**2 for x in [1, 2, 3]}
    print(squares)

    # 交集
    print(set([1, 2, 3]) & set([2, 3, 4]))
    # 并集
    print(set([1, 2, 3]) | set([2, 3, 4]))


# any 与 all：判断列表中是否所有元素都大于 0。
# sorted：按字符串长度排序 ['apple', 'kiwi', 'banana']。
def fn_5():
    # 字典合并：合并 {'a': 1} 和 {'b': 2}。
    d = {**{"a": 1}, **{"b": 2}}
    print(d)

    nums = [1, 2, 3]
    print(all(x > 0 for x in nums))
    print(any(x > 0 for x in nums))

    words = ["apple", "kiwi", "banana"]
    # 排序并返回了新的值
    print(sorted(words, key=len))


def main():
    fn_1()
    fn_2()
    fn_3()
    fn_4()
    fn_5()
    # fn_6()
    # fn_7()


if __name__ == "__main__":
    main()
