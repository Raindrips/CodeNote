#pragma once
#include <vector>
#include <any>
#include <string>
//�ڵ�ӿ�
class Node {
public:
	//����ӽڵ�
	virtual void addChild(Node* node) = 0;

	//�Ƴ��ӽڵ�
	virtual void removeChild(Node* node) = 0;

	//��ȡ�ӽڵ�
	virtual Node* getChild(int index) = 0;

	//�����ӽڵ�
	virtual void setParent(Node* node) = 0;
	//��ȡ���׽ڵ�
	virtual  Node* getParent() = 0;

	//��ȡȫ���ӽڵ�
	virtual std::vector<Node*>& getAllchildren() = 0;

	//��ȡ�ڵ�����
	virtual std::string getName() = 0;

	//��ȡ�ڵ�����
	virtual std::any getVal() = 0;

	//�Ƴ�����ڵ�
	virtual void removeFromParent() = 0;
};