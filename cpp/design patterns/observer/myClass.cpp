#include "myClass.h"
#include "Subject.h"
#include<iostream>
using namespace std;

MyClass::MyClass(Subject* subject)
	:subject(subject)
{
	subject->attach(this);
}
inline void MyClass::update()
{
	cout << "MyClass say hello" << endl;
	cout << subject->getState() << endl;
}

MyClass1::MyClass1(Subject* subject)
	:subject(subject)
{
	subject->attach(this);
}

void MyClass1::update()
{
	cout << "otherClass say hello:" << endl;
	cout << subject->getState() << endl;
}
