
#include <iostream>
#include <exception>
#include "Windows.h"
#include "../Dll1/behavior.h"
#include "../Dll1/MyDll.h"
#pragma comment(lib,"Dll1.lib")

using namespace std;
extern "C" int add(int a, int b);

void use_dll() {
	int val = add(10, 20);
	cout << "val=" << val << endl;
}

void do_dll() {
	//运行时加载DLL库
	HMODULE hmoudle = LoadLibrary(L"DLL1.dll");
	if (hmoudle == nullptr)
	{
		cout << "hmoudle is null" << endl;
		return;
	}
	// 导出函数地址
	using int_fun = int(*)(int, int);
	int_fun pfun = (int_fun)GetProcAddress(hmoudle, "sub");
	if (pfun == nullptr) {
		cout << "faild load fn" << endl;
		return;
	}
	int val2 = pfun(30, 20);
	cout << "val2=" << val2 << endl;
	//释放动态库内存
	FreeLibrary(hmoudle);
}

void class_dll() {
	MyDll* behavior = new MyDll();
	behavior->fn();
}

int main()
{
	use_dll();
	do_dll();
	class_dll();
	int a = 0, c = 0;
	a = (c + 1, 24, c++);
	a = 5 + 1, c = 6 + a;
}
