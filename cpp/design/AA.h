#pragma once
#include "Draw.h"
class Rectangle:public Draw
{
public:
	virtual void draw() override;
	void change();
};

class Circle:public Draw
{
public:
	virtual void draw() override;
};

class Triangle :public Draw
{
public:
	virtual void draw() override;
};


