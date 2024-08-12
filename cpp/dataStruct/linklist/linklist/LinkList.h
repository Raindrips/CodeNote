#pragma once
using Type = int;      		//通过取别名的形式进行灵活使用
//链表节点
struct Node {
    Type data;              //节点存放的数据
    struct Node* next; 	//指向下一个节点的地址
};

//单链表
struct Linklist {
    int size;
    Node* head;		//头结点
};


//链表的初始化
void list_init(Linklist* link);

//创建一个单链表节点
Node* node_create(Type val,Node* node=nullptr);

//判断链表节点是否为空
bool node_empty(Linklist* link);

//链表的大小
bool node_size(Linklist* link);

//链接两个单链表节点
void node_link(Node* n1, Node* n2)=delete;

//单链表的打印输出
void node_print(Linklist* link);


//插入一个链表节点
void node_insert(Linklist* link, int index,Type val);

//删除一个链表
void node_delete(Linklist* link, int index);

//从第index个的位置中获取节点
Node* node_get(Linklist* link, int index);