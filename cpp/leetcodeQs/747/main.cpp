#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
    int dominantIndex(vector<int>& nums) {
        if(nums.size()<2){
			return 0;
		}
		priority_queue<int> pq(nums.begin(),nums.end());
		int a=pq.top(); pq.pop();
		int b=pq.top(); pq.pop();
		if(a>=b*2){
			int q=std::find(nums.begin(),nums.end(),a)-nums.begin();
			return q;
		}
		return -1;
    }
};

int main()
{
	Solution s;
	vector<int>vec={1,3,4,8};
	int a=s.dominantIndex(vec);
	cout<<a<<endl;
	return 0;
}
