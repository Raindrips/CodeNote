#pragma once


// 导出DLL函数
#ifdef CORE_EXPORTS
#define CORE_API __declspec(dllexport)
#else
#define CORE_API __declspec(dllimport)
#endif

//导出可以进行动态调用的DLL
#ifdef _WIN32
#define DLL_EXPORT extern "C" __declspec(dllexport)
#else
#define DLL_EXPORT extern "C"
#endif

CORE_API void DLL_log(const char* msg);

CORE_API const char* GetName();

struct CORE_API ICore
{
	virtual void Log(const char* msg) = 0;
};

DLL_EXPORT void init(int id, const char* msg);
