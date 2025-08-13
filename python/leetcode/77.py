from itertools import combinations
from typing import List


class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        return list(combinations(range(1, n + 1), k))


def test():
    print(Solution().combine(4, 2))


if __name__ == "__main__":
    test()
