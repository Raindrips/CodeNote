#include <iostream>
#include "FindPath.h"
using namespace std;

int main()
{
	//路径应该用两个斜杠
	FindPath findPath("D:\\dev");

	//路径
	for (string path : findPath.getFilePath()) {
		
		cout << path << endl;
		//返回c语言的字符串
		const char* cpath = path.data();

	}
	std::cout << "一共" << findPath.getFilePath().size() << "个文件" << std::endl;
	return 0;
}