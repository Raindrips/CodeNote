#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
      int freq[256]={0};
			int l=0,r=0;
			int res=0;
			while(l<s.size()){
				if(r<s.size()&&freq[s[r]]==0){
					freq[s[r++]]++;
				}else{
					freq[s[l++]]--;
				}
				res=std::max(res,r-l);
			}
			return res;
    }
};

int main()
{
	Solution sol;
	int r=sol.lengthOfLongestSubstring("bbbbbb");
	cout<<r<<endl;
	return 0;
}
