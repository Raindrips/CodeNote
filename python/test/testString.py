# 11. 反转字符串：反转 "world"。
def fn_1():
    str = "world"
    str2 = str[::-1]
    print(str2)


# 12. 判断回文：判断字符串是否为回文。
def fn_2():
    s = "level"
    is_palindrome = s == s[::-1]
    print(is_palindrome)


# 13. 大小写切换：把 "Hello World" 的大小写反转。
def fn_3():
    s = "Hello World"
    print(s.swapcase())


# 14.查找子串：判断 "world" 是否在 "hello world" 中。
def fn_4():
    print("hello" in "hello world")


# 15.字符串格式化：用 f-string 格式化 "name=Tom, age=20"。
# 16.统计字符：统计 "banana" 中 a 出现的次数。
# 17.去除空格：去掉 " hello world " 前后的空格。
def fn_5():
    name = "Tom"
    age = 10
    print(f"name={name},age={age}")

    print("banana".count("a"))

    print(" hello  world".strip())


# 18.多行字符串：输出多行字符串，不用 \n。
def fn_6():
    s = """
这是一段多行文本
可以任意支持换行
    """
    print(s)


# 19. join 与 split：把 ['a', 'b', 'c'] 变成 'a-b-c'。
# 20. 字符串替换：把 "I like apple" 中的 apple 替换为 banana。
def fn_7():
    s = ["a", "b", "c"]
    s1 = "-".join(s)
    print(s1)

    # 字符串分割
    s4 = s1.split("-")
    print(s4)

    s2 = "I have a pen"
    s3 = s2.replace("pen", "apple")
    print(s2)
    print(s3)


def main():
    fn_1()
    fn_2()
    fn_3()
    fn_4()
    fn_5()
    fn_6()
    fn_7()


if __name__ == "__main__":
    main()
