#pragma once
#include "observer.h"
class Subject;
class MyClass:Observer
{
public:
	MyClass(Subject* subject);

	void update() override;

private:
	Subject* subject;
};

class MyClass1 :Observer
{
public:
	MyClass1(Subject* subject);

	void update() override;

private:
	Subject* subject;
};