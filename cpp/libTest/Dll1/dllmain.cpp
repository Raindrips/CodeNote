// dllmain.cpp : 定义 DLL 应用程序的入口点。
#include "pch.h"
#include <iostream>
using namespace std;
BOOL APIENTRY DllMain( HMODULE hModule,
                       DWORD  ul_reason_for_call,
                       LPVOID lpReserved
                     )
{
    cout << "use dll" << endl;
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        cout << "process_attach" << endl;
        break;
    case DLL_THREAD_ATTACH:
        cout << "theard_attach" << endl;
        break;
    case DLL_THREAD_DETACH:
        cout << "theard_deach" << endl;
        break;
    case DLL_PROCESS_DETACH:
        cout << "process_deach" << endl;
        break;
    }
    return TRUE;
}

