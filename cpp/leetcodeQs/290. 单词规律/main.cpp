#include <iostream>
#include <vector>
#include <bits/stdc++.h>
using namespace std;

class Solution
{
public:
	void split(vector<string> &tokens, const string &s, const char &delim = ' ')
	{
		tokens.clear();
		size_t lastPos = s.find_first_not_of(delim, 0);
		size_t pos = s.find(delim, lastPos);
		while (lastPos != string::npos)
		{
			tokens.emplace_back(s.substr(lastPos, pos - lastPos));
			lastPos = s.find_first_not_of(delim, pos);
			pos = s.find(delim, lastPos);
		}
	}

	bool wordPattern(string pattern, string s)
	{
		vector<string> vec;
		this->split(vec, s);
		if (pattern.size() != vec.size())
		{
			return false;
		}
		unordered_map<char, int> pam;
		unordered_map<string, int> stm;
		int pc = 1;
		int sc = 1;
		for (int i = 0; i < pattern.size(); i++)
		{
			if (!pam[pattern[i]])
			{
				pam[pattern[i]] = pc;
				pc++;
			}
			if (!stm[vec[i]])
			{
				stm[vec[i]] = sc;
				sc++;
			}
			if (pam[pattern[i]] != stm[vec[i]])
			{
				return false;
			}
		}
		return true;
	}
};

int main()
{
	Solution s;
	bool b = s.wordPattern("abba", "dog cat cat dog");
	cout << boolalpha << b << endl;
	return 0;
}
