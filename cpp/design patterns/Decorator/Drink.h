#pragma once
#include <string>
class Drink {
public:
	//¼Û¸ñ
	virtual double money() = 0;
	//ÃèÊö
	virtual std::string desc()=0;
};