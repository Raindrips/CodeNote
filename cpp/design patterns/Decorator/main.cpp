// Decorator.cpp: 目标的源文件。
//

#include "main.h"
#include <iostream>
#include "Soya.h"
#include <iterator>

using namespace std;
int main()
{
	Drink *s = new Soya();
	cout << s->desc() << endl;
	cout << s->money() << endl;
	Drink* rb = new ReadBean(s);
	cout << rb->desc() << endl;
	cout << rb->money() << endl;
	Drink* egg = new Egg(rb);
	cout << egg->desc() << endl;
	cout << egg->money() << endl;

	delete s;
	delete rb;
	delete egg;
	return 0;
}
