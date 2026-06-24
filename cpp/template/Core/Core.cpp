
#include "pch.h"
#include "framework.h"
#include "Core.h"
#include <iostream>

#ifdef CORE_EXPORTS
#define CORE_API __declspec(dllexport)
#else
#define CORE_API __declspec(dllimport)
#endif


void fnCore()
{
}

void Core_Log(const char* msg)
{
	std::cout << msg << std::endl;
}

