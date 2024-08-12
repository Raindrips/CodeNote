#include <iostream>
#include <vector>
using namespace std;

/*

给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的连续子数组。如果不存在符合条件的连续子数组，返回 0。
*/
class Solution {
public:
    int minSubArrayLen(int s, vector<int>& nums) {
		int l=0;
		int r=0;   
		int sum=0;
		int res= nums.size()+1;
		
        while(l<nums.size()){
			if(r+1<nums.size()&&sum<s){
				sum+=nums[r++];
			}else{
				sum-=nums[l++];
			}
			if(sum>=s){
				res=std::min(res,r-l);
			}
		}
		if(res==nums.size()+1)
			return 0;
		return res;
    }
};

int main()
{
	Solution s;
	vector<int> vec({2,3,1,2,4,3});
	int r=s.minSubArrayLen(7,vec);
	cout<<r<<endl;
	return 0;
}
