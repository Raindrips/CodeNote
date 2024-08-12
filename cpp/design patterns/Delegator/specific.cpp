#include "specific.h"
#include <string>
#include <iostream>
using namespace std;

AA::AA(Delegetor* _delegetor)
{
	setDelegator(_delegetor);
}

void AA::update()
{
	cout << "updata()" << endl;
	string str = to_string(a++)+":hello";

	_delegetor->callBack(this,str.c_str());
}

void AA::setDelegator(Delegetor* delegetor)
{
	this->_delegetor = delegetor;
}

void BB::callBack(void* ctx, const char* str)
{
	if(str)
		cout << str << endl;
	if (ctx)
		cout << ctx << endl;
}
