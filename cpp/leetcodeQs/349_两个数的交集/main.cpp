#include <iostream>
#include <vector>
#include <bits/stdc++.h>
#include <unordered_map>
using namespace std;

class Solution
{
public:
	vector<int> intersection(vector<int> &nums1, vector<int> &nums2)
	{
		unordered_set<int> codebook;

		for (int num : nums1)
			codebook.insert(num);

		vector<int> ans;
		for (int num : nums2)
		{
			if (codebook.count(num))
			{
				ans.push_back(num);
				codebook.erase(num);
			}
		}

		return ans;
	}
};
int main()
{
	Solution s;
	vector<int> vec1 = {1, 2, 3, 4, 5};
	vector<int> vec2 = {2, 3};
	auto v = s.intersection(vec1, vec2);
	for (auto e : v)
	{
		cout << e << " ";
	}
	cout << endl;
	return 0;
}
