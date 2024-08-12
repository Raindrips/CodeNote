#include "Singleton.h"

Singleton* Singleton::instance = new Singleton();

Singleton* Singleton::getInstance()
{
	return instance;
}