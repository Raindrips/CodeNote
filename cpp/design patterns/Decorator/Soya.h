#pragma once
#include "decorator.h"
class Soya :public Decorator {
public:
	virtual double money() override;
	virtual std::string desc() override;
	Soya(Drink* drink=nullptr);
};

class ReadBean :public Decorator {
public:
	virtual double money() override;
	virtual std::string desc() override;
	ReadBean(Drink* drink);
};

class Egg :public Decorator {
public:
	virtual double money() override;
	virtual std::string desc() override;
	Egg(Drink* drink);
};