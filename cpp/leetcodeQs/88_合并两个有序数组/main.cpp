#include <iostream>
#include <vector>
#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        //int r=std::max(n,m);
        int l=0;
        int r=0;
        vector<int> vec(n+m);
        for(int i=0;i<n+m;i++){
            if(l>=m){
                vec[i]=nums2[r++];
            }
            else if(r>=n){
                vec[i]=nums1[l++];
            }
            else if(nums1[l]<nums2[r]){
                vec[i]=nums1[l++];
            }else{
                vec[i]=nums2[r++];
            }
        }
        nums1.assign(vec.begin(),vec.end());
    }
};
int main()
{
	
	return 0;
}
