#include"output.hpp"
class Solution {
public:
  int fun(int n, int i) {
	if (n==i)
	{
	  return 1;
	}
	if (i > n) {
	  return 0;
	}
	return fun(n, i + 1) + fun(n, i + 2);
  }
  int climbStairs(int n) {
	return fun(n, 0);
  }
};

const static auto t = []() {
  int a = Solution().climbStairs(0);
  cout << a << endl;
  return nullptr;
}();

