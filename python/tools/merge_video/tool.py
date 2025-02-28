"""遍历全部文件目录，返回文件路径列表"""

import os
import re


def get_all_file_path(root_dir: str) -> list:
    file_path_list = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            file_path = os.path.join(root, file)
            file_path_list.append(file_path)

    # 按照文件名进行排序,非必要可以注释
    file_path_list = sorted(file_path_list, key=lambda x: int(filter_key(x)))
    return file_path_list


# 根据文件类型过滤文件
def filter_file(file_path_list: list, file_type: str) -> list:
    file_path_list = [
        file_path for file_path in file_path_list if file_path.endswith(file_type)
    ]
    return file_path_list


# 根据文件名过滤文件
def filter_file_by_name(file_path_list: list, file_name: str) -> list:
    file_path_list = [
        file_path for file_path in file_path_list if file_name in file_path
    ]
    return file_path_list


def filter_key(name: str) -> str:
    # 定义正则表达式模式
    pattern = r"\d+$"
    match = re.search(pattern, name)
    if match:
        # 提取匹配的数字
        number = match.group()
        return number
    return -1


def split_array(arr, n):
    """
    将数组 arr 拆分成 n 个子数组（尽可能均匀）
    """
    avg = len(arr) / float(n)
    out = []
    last = 0.0
    while last < len(arr):
        out.append(arr[int(last) : int(last + avg)])
        last += avg
    # 处理最后一个子数组可能包含剩余元素的情况
    if out[-1] != arr[int(last) :]:
        out.append(arr[int(last) :])
    # 移除空子数组（如果有的话）
    return [sublist for sublist in out if sublist]


def test():
    if __name__ != "__main__":
        return
    root_dir = "D:\\Downloads\\car_1"
    file_path_list = get_all_file_path(root_dir)
    for file_path in file_path_list:
        print(file_path)


def test2():
    if __name__ != "__main__":
        return
    root_dir = "D:\\Downloads\\hello 123"
    n = filter_key(root_dir)

    if n:
        print(f"提取到的数字是: {n}")

    else:
        print("没有匹配到")
    
    arr=split_array([1,2,3,4,5,6,7,8,9,0],4)
    print(arr)

test2()
