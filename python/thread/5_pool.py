from concurrent.futures import ThreadPoolExecutor
import time

def task(n):
    time.sleep(1)
    return f"任务 {n} 完成"

# 使用线程池
with ThreadPoolExecutor(max_workers=3) as executor:
    # 提交任务
    futures = [executor.submit(task, i) for i in range(12)]
    # 获取结果
    for future in futures:
        print(future.result())
