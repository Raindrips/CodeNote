#include "main.h"
#include <list>
#include <iostream>
using namespace std;

int main(int argc,char* argv[])
{
	list<int> l(10);
	int i=0;
	for (auto& e:l)
	{
		e = i;
		i++;
	}
	l.remove_if([](int val) {return val % 2 == 0 || val / 2 == 0;});

	for (int i = 0; i < argc; i++)
	{
		cout << argv[i] << endl;
	}
	return 0;
}
