#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> distributeCandies(int candies, int num_people) {
        vector<int> ans(num_people);
        int n=0;
        int count=1;
        while(candies>0){
            if(candies>count){
                ans[n]+=count;
                candies-=count;
            }
            else{
                ans[n]+=candies;
                candies=0;  
            }
            count++;
            n++;
            n%=num_people;
        }
        return ans;
    }
};