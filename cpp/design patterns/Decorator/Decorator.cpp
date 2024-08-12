#include "Decorator.h"

double Decorator::money()
{
	return drink->money();
}

std::string Decorator::desc()
{
	return  drink->desc();
}

Decorator::Decorator(Drink* drink)
	:drink(drink)
{
	
}

void Decorator::setDrink(Drink* drink)
{
	this->drink = drink;
}
