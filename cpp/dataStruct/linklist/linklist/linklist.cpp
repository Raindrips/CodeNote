#include "LinkList.h"
#include <iostream>
using namespace std;

void list_init(Linklist* link)
{
	link->size = 0;
	link->head = nullptr;
}

Node* node_create(Type val, Node* node = nullptr)
{
	Node* temp = new Node;
	temp->data = val;
	temp->next = node;
	return temp;
}

bool node_empty(Linklist* link)
{
	return link->size==0;
}

bool node_size(Linklist* link)
{
	return link->size;
}

void node_link(Node* n1, Node* n2)
{
	n1->next = n2;
}

void node_print(Linklist* link)
{
}

void node_insert(Linklist* link, int index, Type val)
{
	
	if (index>node_size(link)||index<0) {
		cerr << "插入位置错误";
		return;
	}
	else if (node_empty(link))
	{
		link->head = node_create(val);
	}
	else if(index==0){
		link->head = node_create(val, link->head);
	}
	else {
		Node* temp = node_get(link, index - 1);
		temp->next = node_create(val, temp->next);
	}
	link->size++;
}

void node_delete(Linklist* link, int index)
{
	if (index==0)
	{
		Node* temp = link->head;
		link->head = link->head->next;
		delete temp;
	}
	Node* temp = node_get(link, index - 1);
	if (temp)
	{
		temp->next = temp->next->next;
	}
	link->size--;
}

Node* node_get(Linklist* link, int index)
{
	if (index >= node_size(link) || index < 0) {
		cerr << "位置错误" << index << endl;
		return nullptr;
	}
	Node* temp = link->head;
	for (int i = 0; i < index; i++)
	{
		temp = temp->next;
	}
	return temp;
}
