#include "tree.h"
#include <stack>
#include <iostream>
#include <set>
#include <cassert>
using namespace std;


void Tree::traverse()
{
	std::stack<Node*> tmp;			//声明一个栈
	tmp.push(root);					//根节点入栈
	while (!tmp.empty())
	{
		Node* node = tmp.top();		//获取栈顶元素
		tmp.pop();					//栈顶元素出栈
		auto val = node->getName();
		std::cout << val << " ";	//输出节点
		//遍历子节点
		for (auto n : node->getAllchildren()) {
			//将这颗树的所有子节点入栈
			tmp.push(n);
		}
	}
	std::cout << "\n";
}


Tree::Tree(Node* root)
	: root(root)
{
}

Tree::~Tree()
{
	std::stack<Node*> tmp;	  //声明一个栈
	tmp.push(root);				  //根节点入栈
	while (!tmp.empty())
	{
		Node* node = tmp.top();	//获取栈顶元素
		tmp.pop();					//栈顶元素出栈
		//遍历子节点
		for (auto n : node->getAllchildren()) {
			//将这颗树的所有子节点入栈
			tmp.push(n);
		}
		delete node;
	}
}

Node* Tree::getRoot()
{
	return root;
}