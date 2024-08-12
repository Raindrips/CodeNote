#pragma once
/*
 * 二叉搜索树的特性
 * 每个节点的左孩子比根节点小
 * 每个节点的右孩子比根节点大
 * 
 */
#include <iostream>
using namespace std;
template<typename K,typename V>
class BST
{
	struct Node
	{
		K key;
		V val;
		Node *left;
		Node *right;
		Node(K &k, V& v, Node *left = nullptr, Node *right = nullptr) :key(k), val(v), left(left), right(right)
		{
			
		}
	};

	int count;   //树的大小
	Node* root;

	Node* insert(Node* node, K key, V val)
	{
		if (node==nullptr)
		{
			count++;
			return new Node(key, val);
		}
		if (key==node->key)//去重
		{
			node->val = val;	//通过key对应值
			return node;
		}
		if(key<node->key)
		{
			node->left = insert(node->left, key, val);
		} 
		else if(key>node->key)
		{
			node->right = insert(node->right,key, val);
		}

		return node;
	}

	Node *findMin(Node *node)
	{
		if (node->left==nullptr)
		{
			return node;
		}
		return findMin(node->left);
	}

	Node *findMax(Node *node)
	{
		if (node->right == nullptr)
		{
			return node;
		}
		return findMax(node->right);
	}

	Node* popMin(Node*node)
	{
		if (node->left==nullptr)
		{
			Node* temp = node->right;
			delete node;
			count--;
			return temp;
		}
		node->left = popMin(node->left);
		return node;
	}

	Node* popMax(Node*node)
	{
		if (node->right == nullptr)
		{
			Node* temp = node->left;
			delete node;
			count--;
			return temp;
		}
		node->right = popMin(node->right);
		return node;
	}

	Node* remove(Node*node, K key)
	{
		if (!node)
		{
			return nullptr;
		}
		if (key<node->key)
		{
			node->left = remove(node->left, key);
			return node;
		}
		if (key>node->key)
		{
			node->right = remove(node->right, key);
			return node;
		}
		else
		{
			if (node->left==nullptr)
			{
				Node *temp = node->right;
				count--;
				delete node;
				return temp;
			}
			if (node->right == nullptr)
			{
				Node* temp = node->left;
				delete node;
				count--;
				return temp;
			}
			else
			{
				Node*temp = findMin(node->right);
				node->key = temp->key;
				node->val = temp->val;
				node->right = popMax(node->right);
				delete node;
				count--;
				return node;
			}
			
		}

	}

	Node* at(Node*node, K key)
	{
		if (node==nullptr)
		{
			return nullptr;
		}
		if (key==node->key)
		{
			return node;
		}
		if (key < node->key)
		{
			return at(node->left, key);
		} 
		else
		{
			return at(node->right, key);
		}
	}

	bool contain(Node* node,K key)
	{
		if (node==nullptr)
		{
			return false;
		}
		if (node->key==key)
		{
			return true;
		}
		if (key<node->key)
		{
			return contain(node->left, key);
		}
		else
		{
			return contain(node->right, key);
		}
	}

	void out(Node* n)
	{
		if (n==nullptr)
		{
			return;
		}
		std::cout<< n->key << ":" << n->val <<std::endl;
		out(n->left);
		out(n->right);
	}
public:
	BST()
	{
		count = 0;
		root = nullptr;
	}

	//返回树的当前大小
	int size()
	{
		return count;
	}

	//判断是否为空
	bool empty()
	{
		return count == 0;
	}

	//插入
	void insert(K key,V val)
	{
		root = insert(root, key, val);
	}

	//找到最小值
	Node* findMin()
	{
		return findMin(root);
	}
	
	//找到最大值
	Node* findMax()
	{
		return findMax(root);
	}

	//删除最小值
	void popMin()
	{
		if (root)
		{
			root = popMin(root);
		}
	}

	//删除最大值
	void popMax()
	{
		if (root)
		{
			root = popMax(root);
		}
	}

	//删除一个值
	void remove(K key)
	{
		root = remove(root, key);
	}

	Node* at(K key)
	{
		return at(root,key);
	}

	bool contain(K key)
	{
		return contain(root,key);
	}

	//输出
	void out()
	{
		out(root);
	}

};

