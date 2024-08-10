#include <iostream>
#include <vector>
#include <set>
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
 //定义一个寻找公约数的方法
 int gcd (int a, int b) {
        return b == 0? a: gcd(b, a % b);
    }
	//卡牌分组
	bool hasGroupsSizeX(vector<int>& deck) {
		if(deck.size()<2)
				return false;
		map<int,int> m;
		for(auto &e:deck)
			m[e]++;
		
		 // 求gcd
        int x = 0;
        for(auto e: m) {
							x = gcd(x, e.second); 
							if (x == 1) { 
								return false;
					}
        }
		return true;
	}
};
int main()
{
	Solution s;
	vector<int> vec={1,1,1,2,2,2,3,3,3};
	bool b=s.hasGroupsSizeX(vec);
	cout<<boolalpha<<b<<endl;
	return 0;
}
