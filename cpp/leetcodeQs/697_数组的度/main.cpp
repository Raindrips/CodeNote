#include <iostream>
#include <vector>
#include <bits/stdc++.h>
using namespace std;

/*
	分析:
		找出出现次数最多的数
		数据第一次出现的次数
		数据第二次出现的次数
*/
class Solution {
private:
	struct NumTimes{
		int times=0;
		int first=0;
		int last=0;
	}
public:
    int findShortestSubArray(vector<int>& nums) {
			unordered_map<int,NumTimes> dict;
			for(int i=0;i<nums;i++){
				
			}
    }
};

int main()
{
	
	return 0;
}
