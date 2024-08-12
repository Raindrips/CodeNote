// 二叉搜索树.cpp : 定义控制台应用程序的入口点。
//

#include "stdafx.h"
#include <vector>
#include <iostream>
#include <string>
#include "BST.h"
using namespace std;

//二分查找法
//有序的数组进行折半查找
template<typename T>
int BinnarySearch(vector<T> arr,T targer)
{
	int l = 0,r=arr.size()-1;
	int mid;
	while (l<=r)
	{
		mid = (l + r) / 2;
		if (arr[mid]==targer)	//找到了
		{
			return mid;
		}
		if (arr[mid]>targer)
		{
			r = mid - 1;
		}
		else
		{
			l = mid + 1;
		}
	}
	return -1;
}


void test1()
{
	vector<int> vec = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
	int index = BinnarySearch(vec, 8);
	cout << "[" << index << "]" << vec[index] << endl;
}
int main()
{
	//test1();
	BST<string, int> bst;
	bst.insert("a", 10);
	bst.insert("b", 20);
	bst.insert("c", 30);
	bst.insert("d", 40);
	bst.insert("e", 50);
	bst.out();
	
	cout << "--------------------------------" << endl;
	auto n = bst.findMin();
	cout << n->key << ":" << n->val << endl;
	auto n2 = bst.findMax();
	cout << n2->key << ":" << n2->val << endl;
	cout << "--------------------------------" << endl;
	bst.remove("c");
	bst.out();
	cout << "--------------------------------" << endl;
	auto n3=bst.at("d");
	cout << n3->key << ":" << n3->val << endl;

	auto n4 = bst.contain("a");
	cout <<boolalpha<< n4 << endl;
	return 0;
}

