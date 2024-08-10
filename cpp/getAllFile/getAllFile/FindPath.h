#pragma once
#undef UNICODE
#undef _UNICODE 
#include <string>
#include <vector>


class FindPath
{
public:
	//传入要查看的路径
	FindPath(std::string path);

	std::vector<std::string> getFilePath();

private:
	void changePath(std::string path);
	std::string path;
	std::vector<std::string> allPath;
};

