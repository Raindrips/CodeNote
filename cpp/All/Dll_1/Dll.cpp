#include"pch.h"
#include "Dll.h"
#include <iostream>


void DLL_log(const char* msg)
{
	std::printf(msg);
}

const char* GetName()
{
	return "hello DLL";
}

void init()
{
	std::cout << "DLL_1 init" << std::endl;
}
