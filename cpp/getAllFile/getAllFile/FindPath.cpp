#include "FindPath.h"

#include <stdio.h>
#include "windows.h"

using namespace std;

FindPath::FindPath(string path)
{
	this->path = path;
	this->changePath(path);
}

void FindPath::changePath(string path)
{
	WIN32_FIND_DATA wfd;
	HANDLE hfd;
	char cdir[MAX_PATH] = {};
	char subdir[MAX_PATH] = {};
	int r;
	GetCurrentDirectory(MAX_PATH, cdir);
	SetCurrentDirectory(path.data());
	hfd = FindFirstFile("*.*", &wfd);
	if (hfd != INVALID_HANDLE_VALUE) {
		do {
			if (wfd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
			{
				if (wfd.cFileName[0] != '.') {
					// 合成完整路径名 
					sprintf_s(subdir, "%s//%s", path.data(), wfd.cFileName);
					// 递归枚举子目录 
					changePath(subdir);
				}
			}
			else {
				//printf("%s\\%s\n", cpath, wfd.cFileName);
				allPath.push_back(path + wfd.cFileName);
			}
		} while (r = FindNextFile(hfd, &wfd), r != 0);
	}
	SetCurrentDirectory(cdir);
}

vector<string> FindPath::getFilePath()
{
	return allPath;
}