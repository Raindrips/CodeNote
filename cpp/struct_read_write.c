#include <stdio.h>
#include <stdlib.h>
#define N 5

struct student
{
	char name[20];//名字
	int id;//学号
	double score;//成绩
}person[20] = {
	{ "项目",1 ,100},
	{ "程序",3 ,200},
	{ "问问",2 ,300},
	
};

void write(const char *path,struct student *student){
	FILE *file= fopen(path,"a+");
	if(file==NULL){
		puts("打开文件失败!");
		exit(0);
	}
	fprintf(file,"%s %d %lf\n",student->name,student->id,student->score);
	fclose(file);
}

int main(){
	for (size_t i = 0; i < 3; i++)
	{
		write("data.txt",&person[i]);
	}
	return 0;
}
