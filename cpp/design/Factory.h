#pragma once
#include "Draw.h"
class Draw;	//声明符号

//工厂类
class Factory
{

public:
	Draw* getDraw(const char *str);
};

