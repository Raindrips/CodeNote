import time

# 测量时间的函数
def test_loop():
    start_time = time.time()  # 记录开始时间
    count = 0  # 初始化计数器
    
    while True:
        count += 1
        if time.time() - start_time >= 1:  # 当执行时间超过 1 秒时，停止
            break
    
    return count

def calculate_average(arr):
    if len(arr) == 0:  # 防止除以零
        return 0
    return sum(arr) / len(arr)

# 输出循环多少次会阻塞 1 秒
def test_repeat(times):
    count=[]
    for i in  range(times):
        count.append(test_loop())
    aver=calculate_average(count)
    print('平均1秒执行',aver,'次')


test_repeat(10)