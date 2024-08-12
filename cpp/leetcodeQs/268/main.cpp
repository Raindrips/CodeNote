#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int missingNumber(vector<int>& nums) {
        vector<int> t(nums.size()+1);
		for(auto e:nums){
			t[e]++;
		}
		for(int i=0;i<t.size();i++){
			if(t[i]==0){
				return i;
			}
		}
		return -1;
    }
};

int main()
{
	
	return 0;
}
