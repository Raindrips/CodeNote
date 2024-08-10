#include <iostream>
#include <fstream>
#include <vector>

using namespace std;

//用于确定个文件（以三张图片为例）信息
#pragma pack(1)
struct FileInfo
{
	size_t  fileSize;				//文件大小
	size_t fileoff;					//文件位置
	char fileName[255];				//文件名
	size_t fileNameSize;			//文件名大小

};
#pragma pack()

//文件打包

/*格式
	文件数量
	文件大小
	for (文件数量)
		文件信息
	for (文件信息)
		文件信息.偏移量
		文件信息.文件大小
*/
bool pack(vector<string> files, string packFile) {
	fstream pack;
	fstream filestream;

	size_t num = 0;
	size_t size = sizeof(num) + sizeof(size);
	vector<FileInfo> fileInfoVec;
	for (const auto& filename : files) {
		FileInfo file = {};
		strcpy_s(file.fileName, filename.data());
		file.fileNameSize = filename.size();

		filestream.open(filename.data(), ios::in | ios::binary);
		if (!filestream.is_open()) return false;
		filestream.seekg(0, ios::end);				//文件指针移到到末尾
		file.fileSize = filestream.tellg();			//通过文件指针偏移量,得到文件大小
		filestream.close();
		//计算文件大小
		size += sizeof(FileInfo);
		num++;
		fileInfoVec.push_back(file);
	}

	for (int i = 0; i < fileInfoVec.size(); i++) {
		if (i == 0) {
			fileInfoVec[i].fileoff = size;
		}
		else {
			fileInfoVec[i].fileoff = fileInfoVec[i - 1].fileoff + fileInfoVec[i - 1].fileSize;
		}
	}

	//打包文件
	pack.open(packFile.data(), ios::out | ios::binary);

	pack.write((char*)&num, sizeof(num));
	pack.write((char*)&size, sizeof(size));


	for (const auto& fileInfo : fileInfoVec) {
		pack.write((char*)&fileInfo, sizeof(fileInfo));
	}

	for (int i = 0; i < num; i++) {
		pack.seekg(fileInfoVec[i].fileoff);
		filestream.open(files[i], ios::in | ios::binary);
		char buf[BUFSIZ];
		while (!filestream.eof()) {
			auto& is = filestream.read(buf, sizeof(buf));
			//gcount获取上一次的读取大小
			pack.write(buf, is.gcount());
		}
		filestream.close();
	}
	pack.close();
	return true;
}

//解包
bool unpack(string filepath) {
	fstream fs;
	//读文件
	fs.open(filepath, ios::in | ios::binary);

	if (!fs.is_open()) return false;

	size_t  num = 0, size = 0;
	fs.read((char*)&num, sizeof(int));
	fs.read((char*)&size, sizeof(int));
	cout << num << " " << size << endl;
	FileInfo fileInfo[3] = {};
	for (size_t i = 0; i < num; i++) {
		fs.read((char*)&fileInfo[i], sizeof(FileInfo));
	}
	for (size_t i = 0; i < num; i++) {
		cout << fileInfo[i].fileName << endl;
		fstream os(fileInfo[i].fileName, ios::out|ios::binary);
		os.seekg(fileInfo[i].fileoff,ios::beg);
		char *buf= new char[fileInfo[i].fileSize]();
		fs.seekg(fileInfo[i].fileoff,ios::beg);
		//读取包中的数据
		fs.read(buf, fileInfo[i].fileSize);
		//写入文件数据
		os.write(buf, fileInfo[i].fileSize);
		os.close();
	}
	return true;
}

void test() {
	//写文件
	fstream is("test.bin",ios::out| ios::binary);
	int a = 0x11,b=0x55;
	//is << a << b;
	is.write((char*)&a, sizeof(int));
	is.write((char*)&b, sizeof(int));
	is.close();
	
	//读文件
	fstream os("test.bin", ios::in | ios::binary);
	int ra = 0, rb = 0;
	os.read((char*)&ra, sizeof(int));
	os.read((char*)&rb, sizeof(int));
	cout <<hex<< a << " " << b << endl;
	
	os.close();
}


int main() {
	//打包文件
	vector<string> file = { "1.txt","2.txt" };
	pack(file, "1.pak");
	unpack("1.pak");
	//test();
}