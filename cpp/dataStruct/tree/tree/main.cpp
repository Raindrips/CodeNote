// tree.cpp: 定义应用程序的入口点。


#include "tree.h"
#include "treeNode.h"
#include <iostream>

using namespace std;

void t1() {
	auto A=new TreeNode(1);
	auto B = new TreeNode(2);
	auto C = new TreeNode(3);
	A->addChild(B);
	A->addChild(C);
	Tree t(A);
	t.traverse();
}

int main(int argc,char* argv[])
{
	for (int i = 0; i < argc; i++)
	{
		cout << argv[i] << endl;
	}
	
	return 0;
}
