#include "Soya.h"

double Soya::money()
{
	if (drink)
	{
		return drink->money() + 5;
	}
	return 5;
}

std::string Soya::desc()
{
	if (drink)
	{
		return drink->desc() + "���� ";
	}
	return "���� ";
}

Soya::Soya(Drink* drink)
	:Decorator(drink)
{
}

double ReadBean::money()
{	
	if (drink)
	{
		return drink->money() + 3;
	}
	return 3;
}

std::string ReadBean::desc()
{
	if (drink)
	{
		return drink->desc() + "��� ";
	}
	return "��� ";
}

ReadBean::ReadBean(Drink* drink)
	: Decorator(drink)
{
}


double Egg::money()
{
	if (drink)
	{
		return drink->money() + 1.5;
	}
	return 1.5;
}

std::string Egg::desc()
{
	if (drink)
	{
		return drink->desc() + "���� ";
	}
	return "���� ";
}

Egg::Egg(Drink* drink)
	: Decorator(drink)
{
}