#pragma once
#include <iostream>
#include <vector>
#include <set>
#include <queue>

#include <unordered_map>
#include <unordered_set>
#include <hash_map>

using namespace std;
class Solution {
public:
  int lastStoneWeight(vector<int>& stones) {
	priority_queue<int> q(stones.begin(), stones.end());
	while (q.size() >= 2)
	{
	  int x = q.top(); q.pop();
	  int y = q.top(); q.pop();
	  int t = std::abs(y - x);
	  if (t != 0)
	  {
		q.push(t);
	  }
	}
	if (!q.empty())
	{
	  return q.top();
	}
	return 0;
  }
};
const static auto t = []() {
  vector<int> vec = { 1,9,13,24,7,6,8 };
  int a = Solution().lastStoneWeight(vec);
  cout << a << endl;
  return nullptr;
}();