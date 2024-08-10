#include <iostream>
#include <vector>
#include <string>
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:  
    bool isPalindrome(string s) {
        deque<char> dq;
        for(char e:s){
            if(isalpha(e)||isalnum(e)){
                dq.push_back(tolower(e));
            }
        }
        cout<<endl;
        if(dq.size()<=1)
            return true;
        while(dq.size()>1){
            if(dq[0]!=dq.back()){
                return false;
            }
            dq.pop_back();
            dq.pop_front();					
        }
        return true;
    }
};

int main(){
  Solution s;
  cout<<s.isPalindrome("A man, a plan, a canal: Panama")<<endl;
  
  return 0;
}