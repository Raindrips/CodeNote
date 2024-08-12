#include <iostream>
#include <vector>
#include <bits/stdc++.h>
using namespace std;
//给定一个已按照升序排列 的有序数组，找到两个数使得它们相加之和等于目标数。
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        vector<int> ret;
        int l=0;
        int r=numbers.size()-1;
        while(l<r){
            int result=numbers[l]+numbers[r];
            if(result==target){
                ret.assign({l+1,r+1});
                return ret;
            }
            else if(result<target){
                l++;
            }
            else{
                r--;
            }
        }
        return ret;
    }
};
int main()
{
	
	return 0;
}
