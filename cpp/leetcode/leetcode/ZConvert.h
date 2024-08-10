#pragma once
#include <string>
#include<iostream>

using namespace std;
/*
将一个给定字符串根据给定的行数，以从上往下、从左到右进行 Z 字形排列。
比如输入字符串为 "LEETCODEISHIRING" 行数为 3 时，排列如下：

L   C   I   R
E T O E S I I G
E   D   H   N

s = "LEETCODEISHIRING", numRows = 4
输出: "LDREOEIIECIHNTSG"
解释:
L     D     R
E   O E   I I
E C   I H   N
T     S     G
*/
class Solution {
public:

  string convert(string s, int numRows) {
	if (numRows==1)
	{
	  return s;
	}
	string* t = new string[numRows];
	int order = 1;
	int index=0;
	for (size_t i = 0; i < s.size(); i++)
	{
	  t[index] += s[i];
	  index += order;
	  if (index>= numRows-1|| index == 0) 
		order = -order;
	}
	s.clear();
	for (auto a = 0; a < numRows; a++) {
	  s += t[a];
	}
	delete[] t;
	return s;
  }
};

void test() {
  Solution s;
  cout << s.convert("LEETCODEISHIRING", 3) << endl;
}