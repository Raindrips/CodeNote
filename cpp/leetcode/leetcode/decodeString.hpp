#pragma once
#include <string>
#include <iostream>
#include "output.hpp"
class Solution {
public:
  string decodeString(string s) {
	string decode;
	auto start = s.begin();
	stringstream ss;
	while (start != s.end())
	{
	  string temp(start, s.end());
	  int f = s.find('[');
	  temp.assign(start, s.begin() + f);
	  string num(s.begin() + f + 1, s.end());
	  int f2 = num.find(']');
	  num.assign(num.begin(), num.begin() + f2);

	  int n;
	  ss << num;
	  ss >> n;
	  cout << temp << " " << n << endl;
	  start = num.end() + 1;
	}
	return s;
  }
};

const static auto a1 = []() {
  Solution s;
  //s.decodeString("3[a]2[bc]");
  string str = "3[a]2[bc]";
  stringstream ss;
  ss << str;
  int a;
  ss >> a;
  cout << a << endl;

  return nullptr;
}();

