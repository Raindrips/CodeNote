#include "pch.h"

#include <iostream>


#ifdef _WINDOWS_

BOOL APIENTRY DllMain(HMODULE hModule,
	DWORD  ul_reason_for_call,
	LPVOID lpReserved
)
{
	switch (ul_reason_for_call)
	{
	case DLL_PROCESS_ATTACH:
		std::cout << "DLL_进程附加" << std::endl;
		break;
	case DLL_THREAD_ATTACH:
		std::cout << "DLL_线程_附加" << std::endl;
		break;
	case DLL_THREAD_DETACH:
		std::cout << "DLL_线程分离" << std::endl;
		break;
	case DLL_PROCESS_DETACH:
		std::cout << "DLL_进程分离" << std::endl;
		break;
	}
	return TRUE;
}

#endif

