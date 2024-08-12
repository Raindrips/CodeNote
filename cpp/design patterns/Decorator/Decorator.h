#pragma once
#include "Drink.h"
class Decorator:public Drink {
public:
	//�۸�
	virtual double money();
	//����
	virtual std::string desc();

	Drink* drink=nullptr;

	Decorator(Drink* drink);
	void setDrink(Drink* drink);
};