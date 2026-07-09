

#include <iostream>
#include <windows.h>

#include "../StaticLib1/lib.h"
#include "../Dll1/Dll1.h"

using namespace std;

typedef int(*int_fun)();

int main()
{
	//std::cout << "Hello World!\n";
	//静态库
	lib_fn(10);

	//
	HMODULE hmoudle = LoadLibrary(L"DLL1.dll");
	if (hmoudle == nullptr)
	{
		printf("dll load failed.");
		return false;
	}
	cout << "start" << endl;
	int_fun p = (int_fun)GetProcAddress(hmoudle, "fnDll1");
	if (p==nullptr)
	{
		cout << "faild" << endl;
		return -1;
	}	
	p();
	fnDll1();
	CDll1* cd = new CDll1();

	FreeLibrary(hmoudle);
	return 0;
}

