# 列表推导式：生成 [1, 4, 9, 16]。
def fn_1():
    # 列表推导式
    squares = [x**2 for x in [1, 2, 3, 4]]
    print(squares)

    # 等价于以下传统for循环：
    squares2 = []
    for x in [1, 2, 3, 4]:
        squares2.append(x**2)
    print(squares2)


# 二维数组：创建 3x3 全 0 矩阵。
def fn_2():
    matrix = [[0] * 3 for _ in range(3)]
    print(matrix)

    # 等效于
    matrix = []
    for _ in range(3):
        row = []
        for __ in range(3):
            row.append(0)
        matrix.append(row)
    print(matrix)

    # 错误！所有行指向同一个列表对象
    # matrix = [[0] * 3] * 3


# 去重：列表 [1, 2, 2, 3] 去重后保持原顺序。
# 切片：取 [1, 2, 3, 4, 5] 的前 3 个元素。
# 负索引：取列表最后一个元素。
# 反转列表：反转 [1, 2, 3]。
def fn_3():
    list_1 = [1, 2, 2, 3]
    unique_list = list(dict.fromkeys(list_1))
    print(unique_list)

    list2 = [1, 2, 3, 4, 5]
    print(list2[:3])

    list3 = [1, 2, 3, 4, 5]
    print(list3[-1:])

    list4 = [1, 2, 3, 4, 5]
    print(list3[::-1])


# 最大最小值：找出 [1, 7, 3] 的最大和最小值。
# 合并列表：合并 [1, 2] 和 [3, 4]。
# 列表复制陷阱：a = [[]] * 3 有什么问题？
# 删除元素：删除 [1, 2, 3, 4] 中的偶数。
def fn_4():
    nums = [1, 7, 3]
    print(max(nums), min(nums))

    print([1, 2] + [3, 4])

    a = [[] for _ in range(3)]
    a[0].append(10)
    print(a)

    list_2 = [1, 2, 3, 4]
    list_3 = [x for x in list_2 if x % 2 != 0]
    print(list_3)


def main():
    fn_1()
    fn_2()
    fn_3()
    fn_4()
    # fn_5()
    # fn_6()
    # fn_7()


if __name__ == "__main__":
    main()
