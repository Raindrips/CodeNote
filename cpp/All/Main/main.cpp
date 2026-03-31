#include <iostream>
#include <windows.h>

#include "Core.h"
#include "Dll.h"

typedef void (*InitFunc)();


// 加载DLL文件
void load_dll() {
	// 加载DLL文件
	HMODULE module_1 = LoadLibrary(__TEXT("Dll_1.dll"));
	if (!module_1) {
		Core_Log("module_1 is null");
		return;
	}
	InitFunc init = (InitFunc)GetProcAddress(module_1, "init");
	if (!init) {
		Core_Log("init is null");
		return;
	}
	init();

}

void test_1() {
	std::cout << "Hello, World!" << std::endl;

	Core_Log("这是导入的库");

	std::cout << GetName() << std::endl;
	DLL_log("动态库输出");
}

int main() {

	test_1();
	load_dll();


	return 0;
}

