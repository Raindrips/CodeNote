from typing import List


class Solution:
    def thirdMax(self, nums: List[int]) -> int:
        sorted_nums = sorted(nums)
        unique_nums = list(set(sorted_nums))
        if len(unique_nums) < 3:
            return unique_nums[-1]
        return unique_nums[-3]


def main():
    solution = Solution()
    print(solution.thirdMax([3, 2, 1]))
    print(solution.thirdMax([2, 2, 3, 1]))
    print(solution.thirdMax([1, 2]))
    print(solution.thirdMax([1, 2, -2147483648]))
    print(
        solution.thirdMax([-2147483648, -2147483456, -2147483648, -2147483648, 1, 1, 1])
    )


if __name__ == "__main__":
    main()
