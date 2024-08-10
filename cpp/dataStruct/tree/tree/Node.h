#pragma once
#include <vector>
#include <any>
#include <string>
//节点接口
class Node {
public:
	//添加子节点
	virtual void addChild(Node* node) = 0;

	//移除子节点
	virtual void removeChild(Node* node) = 0;

	//获取子节点
	virtual Node* getChild(int index) = 0;

	//设置子节点
	virtual void setParent(Node* node) = 0;
	//获取父亲节点
	virtual  Node* getParent() = 0;

	//获取全部子节点
	virtual std::vector<Node*>& getAllchildren() = 0;

	//获取节点名称
	virtual std::string getName() = 0;

	//获取节点数据
	virtual std::any getVal() = 0;

	//移除自身节点
	virtual void removeFromParent() = 0;
};