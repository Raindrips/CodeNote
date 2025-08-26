from math import sqrt
from typing import List


class Solution:
    def areaOfMaxDiagonal(self, dimensions: List[List[int]]) -> int:
        i = 0
        mi = 0
        maxVal = 0
        for dou in dimensions:
            vv = dou[0] * dou[0] + dou[1] * dou[1]
            v = dou[0] * dou[1]
            mv = (
                dimensions[mi][0] * dimensions[mi][0]
                + dimensions[mi][1] * dimensions[mi][1]
            )
            if mv < vv:
                mi = i
                maxVal = v
            if mv == vv:
                if v > maxVal:
                    mi = i
                    maxVal = v
            i = i + 1
        return maxVal


def test(dimensions: List[List[int]]):
    s = Solution()
    print(s.areaOfMaxDiagonal(dimensions))


if __name__ == "__main__":
    test([[9, 3], [8, 6]])
    test([[4, 3], [4, 3]])
    test(
        [
            [25, 60],
            [39, 52],
            [16, 63],
            [33, 56],
        ]
    )
