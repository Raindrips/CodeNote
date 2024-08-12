// observer.cpp: 目标的源文件。

#include <iostream>
#include "Subject.h"
#include "myClass.h"
#include <memory>
using namespace std;


//观察着模式
void test() {
	auto s = make_unique<Subject>();
	auto c1 = make_unique<MyClass>(s.get());
	auto c2 = make_unique<MyClass1>(s.get());
	s->setState(15);
	s->setState(20);
}

int main()
{
	test();
	return 0;
}
