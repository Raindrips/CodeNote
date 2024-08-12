#include <vector>

#include "Node.h"




class Tree {
	Node* root;
public:
	Tree(Node* root);
	~Tree();

	Node* getRoot();

	//遍历子树
	void traverse();
};

