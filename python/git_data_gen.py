import datetime
import random


def get_all_sundays_of_year(year: int) -> list[str]:
    """
    生成并返回指定年份所有周日的日期列表。

    Args:
        year: 需要生成周日日期的年份，例如 2025。

    Returns:
        一个包含所有周日日期的字符串列表，格式为 'YYYY-MM-DD'。
    """
    sundays = []
    # 从每年的1月1日开始
    date = datetime.date(year, 1, 1)
    # 找到当年的第一个周日
    while date.weekday() != 6:  # 6 代表周日
        date += datetime.timedelta(days=1)
    # 遍历全年，每隔7天记录一个周日
    while date.year == year:
        sundays.append(date.strftime("%Y-%m-%d"))
        date += datetime.timedelta(days=7)
    return sundays


def generate_random_time() -> str:
    """
    在指定时间段内随机生成一个时间。
    随机时间范围为：10:00 - 12:30 或 14:00 - 22:00。
    Returns:
        一个随机时间字符串，格式为 'HH:MM:SS'。
    """
    # 将时间段转换为总秒数
    time_ranges = [(10 * 3600, 12 * 3600 + 30 * 60), (14 * 3600, 22 * 3600)]
    # 随机选择一个时间段
    start_sec, end_sec = random.choice(time_ranges)
    # 在选定时间段内生成随机秒数
    random_sec = random.randint(start_sec, end_sec)

    # 将秒数转换回时间格式
    hours = random_sec // 3600
    minutes = (random_sec % 3600) // 60
    seconds = random_sec % 60

    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


def generate_and_save_git_dates(year: int, filename: str = "git_dates.txt"):
    """
    生成 2025 年所有周日的随机时间，并将其写入指定文件。

    每个日期和时间组合成一个字符串，用于后续 Git 提交。

    Args:
        year: 需要生成日期的年份。
        filename: 写入日期的文件名。
    """
    print("正在生成所有周日日期...")
    sundays = get_all_sundays_of_year(year)

    with open(filename, "w") as f:
        print(f"正在将日期和时间写入文件: {filename}...")
        for date_str in sundays:
            random_time = generate_random_time()
            full_datetime_str = f"{date_str} {random_time}"
            f.write(full_datetime_str + "\n")
            print(f"写入: {full_datetime_str}")

    print(f"所有日期已成功写入 {filename} 文件。")


# --- 脚本执行入口 ---
if __name__ == "__main__":
    generate_and_save_git_dates(2025)


# 1. 打开 git_dates.txt 文件，复制所有日期
# 2. 将每个日期作为参数传递给一个简单的脚本
# 以下是一个示例，需要根据你的实际情况调整

# 假设你已经准备好一个带有 'commit_message.txt' 文件的提交
# for date in $(cat git_dates.txt); do
#   GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit --amend --no-edit --date="$date"
#   git push -f
# done

# 或者更简单的，每次创建一个新提交时使用该时间
# git commit --date="2025-01-05 10:30:00" -m "新的提交"
# 注意：你需要手动将 git_dates.txt 里的日期复制到 --date 参数后

