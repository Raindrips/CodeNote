#include "pch.h"
#include "MyDll.h"
#include"behavior.h"
#include <iostream>
using namespace std;
void MyDll::start()
{
	cout << "start()" << endl;
}

int MyDll::end(int val)
{
	return val * val;
}

void MyDll::fn()
{
}

IBehavior* create() {
	return NULL;
}