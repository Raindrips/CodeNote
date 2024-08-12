#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
	vector<vector<int>> findContinuousSequence(int target) {
		int r=1;
		int sum=0;
		deque<int> de;
		vector <vector<int>> vec;
		while (r<target){
			if(sum==target){
				vec.emplace_back(vector<int>(de.begin(),de.end()));
			}				            
			if(sum<=target){    
				de.push_back(r);
				sum+=r;
				r++;
			}		
			else if(sum>target){
				sum-=de.front();
				de.pop_front();
			}
			//cout<<"r="<<r<<" sum="<<sum<<endl;
		}
		return vec;
	}
};

int main()
{
	Solution s;
	auto v2=s.findContinuousSequence(9);
	for(auto e2:v2){
		for(auto e:e2){
			cout<<e<<" ";
		}
		cout<<endl;
	}
	return 0;
}
