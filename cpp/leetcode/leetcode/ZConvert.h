#pragma once
#include <string>
#include<iostream>

using namespace std;
/*
��һ�������ַ������ݸ������������Դ������¡������ҽ��� Z �������С�
���������ַ���Ϊ "LEETCODEISHIRING" ����Ϊ 3 ʱ���������£�

L   C   I   R
E T O E S I I G
E   D   H   N

s = "LEETCODEISHIRING", numRows = 4
���: "LDREOEIIECIHNTSG"
����:
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