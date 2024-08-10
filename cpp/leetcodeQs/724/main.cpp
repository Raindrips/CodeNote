#include <iostream>
#include <vector>
using namespace std;

//寻找数组的中心索引
class Solution {
public:
    int pivotIndex(vector<int>& nums) {
		int l=0;
		int r=0;
		for(auto e:nums){
			r+=e;
		}
    for	(int i=0;i<nums.size();i++){
			r-=nums[i];
			if(r==l){
				return i;
			}
			l+=nums[i];
		}
		return -1;
  }
};

int main()
{
	Solution s;
	vector<int> vec={1, 7, 3, 6, 5, 6};
	int a = s.pivotIndex(vec);
	cout<<a<<" "<<endl;
	return 0;
}
