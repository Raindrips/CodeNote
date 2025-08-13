

class Solution:
    def simplifyPath(self, path: str) -> str:
        path_list = path.split("/")
        my_list = []
        for val in path_list:
            if val == "" or val == ".":
                continue
            if val == "..":
                if len(my_list) > 0:
                    my_list.pop()
                continue
            my_list.append(val)
        return '/'+"/".join(my_list)


def test():
    print(Solution().simplifyPath("/home/"))
    print(Solution().simplifyPath("/home//foo/"))
    print(Solution().simplifyPath("/home/user/Documents/../Pictures"))
    print(Solution().simplifyPath("/../"))
    print(Solution().simplifyPath("/.../a/../b/c/../d/./"))


if __name__ == "__main__":
    test()
