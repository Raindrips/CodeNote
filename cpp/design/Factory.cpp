#include "Factory.h"
#include "Draw.h"
#include "AA.h"

#include <string>
using namespace std;

Draw* Factory::getDraw(const char* str)
{
	string s = str;
	if (s=="Rectangle")
	{
		return new Rectangle();
	}
	else if(s == "Circle"){
		return new Circle();
	}
	else if (s == "Triangle") {
		return new Triangle();
	}

	return nullptr;
}
