#include <iostream>
#include <vector>
#include <bits/stdc++.h>
#include <unorder_map>
using namespace std;

//使用双对撞索引
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int,int> um;
        for(int i=0;i<nums.size();i++){
            int com=target-nums[i];
            if (um.find(com)!=um.end()){
                vector<int> v={i,um[com]};
                return v;
            }
            um[nums[i]]=i;
        }
        return vector<int>(2);
    }
};

int main()
{
	
	return 0;
}
