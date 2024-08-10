#pragma once
#include <string>
#include <iostream>
#include<list>
using  namespace std;

//32. 最长有效括号
class Solution {
public:
  int longestValidParentheses(string s) {
	bool flag = false;
	int r = 0;
	int count = 0;
	list<char>st;
	for (const char& c : s) {  
	  if (c=='(')
	  {
		if (st.empty()||!flag)
		{
		  r = 0;
		  flag = false;
		  st.clear();
		}
		st.push_back(c);
	  }
	  if(c == ')' && !st.empty())
	  {
		st.pop_back();
		r++;
		flag = true;
	  }
	  else {
		flag = false;
		st.clear();
	  }
	  count = r > count ? r : count;
	}
	return count*2;
  }
};


void test() {
  Solution s;
  cout << s.longestValidParentheses("((()())") << endl;
}