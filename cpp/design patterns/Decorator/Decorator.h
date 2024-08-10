#pragma once
#include "Drink.h"
class Decorator:public Drink {
public:
	//º€∏Ò
	virtual double money();
	//√Ë ˆ
	virtual std::string desc();

	Drink* drink=nullptr;

	Decorator(Drink* drink);
	void setDrink(Drink* drink);
};