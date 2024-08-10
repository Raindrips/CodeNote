#include<assert.h>
#include <iostream>

using namespace std;

enum Colour
{
  RED,
  BLACK,
};

template<class K, class V>
struct RBTreeNode
{
  RBTreeNode* _left;
  RBTreeNode* _right;
  RBTreeNode* _parent;

  K _key;
  V _value;

  Colour _col;

  RBTreeNode(const K& key, const V& value)
	:_left(nullptr)
	, _right(nullptr)
	, _parent(nullptr)
	, _key(key)
	, _value(value)
	, _col(RED)
  {}
};

template<class K, class V>
class RBTree
{
  typedef RBTreeNode<K, V> Node;
public:
  RBTree()
	:_root(nullptr)
  {}

  bool Insert(const K& key, const V& value)
  {
	if (_root == nullptr)
	{
	  _root = new Node(key, value);
	  _root->_col = BLACK;
	  return true;
	}

	Node* parent = nullptr;
	Node* cur = _root;
	while (cur)
	{
	  if (cur->_key < key)
	  {
		parent = cur;
		cur = cur->_right;
	  }
	  else if (cur->_key > key)
	  {
		parent = cur;
		cur = cur->_left;
	  }
	  else
	  {
		return false;
	  }
	}
	//插入位置找到
	cur = new Node(key, value);
	if (parent->_key < key)
	{
	  parent->_right = cur;
	  cur->_parent = parent;
	}
	else
	{
	  parent->_left = cur;
	  cur->_parent = parent;
	}

	// 检查规则，调平衡 
	//1,p为黑
	//2，p为红，u为红
	//3，p为红，u不存在或者为黑
	while (parent && parent->_col == RED)
	{
	  Node* grandfather = parent->_parent;
	  if (parent == grandfather->_left)
	  {
		Node* uncle = grandfather->_right;
		//uncle存在
		if (uncle && uncle->_col == RED)
		{
		  parent->_col = BLACK;
		  uncle->_col = BLACK;
		  grandfather->_col = RED;
		  //继续往上调节
		  cur = grandfather;
		  parent = cur->_parent;
		}
		else  //uncle不存在或者uncle为黑色
		{
		  if (cur == parent->_right)
		  {
			RotateL(parent);
			swap(parent, cur);
		  }
		  RotateR(grandfather);
		  grandfather->_col = RED;
		  parent->_col = BLACK;

		}
	  }
	  else
	  {
		Node* uncle = grandfather->_left;
		if (uncle && uncle->_col == RED)
		{
		  parent->_col = BLACK;
		  uncle->_col = BLACK;
		  grandfather->_col = RED;
		  cur = grandfather;
		  parent = cur->_parent;
		}
		else//uncle不存在或者为黑
		{
		  if (cur == parent->_left)
		  {
			RotateR(parent);
			swap(parent, cur);
		  }

		  RotateL(grandfather);
		  grandfather->_col = RED;
		  parent->_col = BLACK;
		}
	  }
	}
	_root->_col = BLACK;
	return true;
  }

  void RotateL(Node* parent)
  {
	assert(parent);

	Node* subR = parent->_right;
	Node* subRL = subR->_left;
	parent->_right = subRL;

	if (subRL)
	  subRL->_parent = parent;
	Node* ppNode = parent->_parent;
	subR->_left = parent;
	parent->_parent = subR;
	if (ppNode == nullptr)
	{
	  _root = subR;
	  printf("ppNode==nullptr\n");
	  return;
	}

	/*if (_root == parent)
	{

		subR->_parent = nullptr;
	}*/
	else
	{
	  if (ppNode->_left == parent)
	  {
		ppNode->_left = subR;
		subR->_parent = ppNode;
	  }
	  else
	  {
		ppNode->_right = subR;
		subR->_parent = ppNode;
	  }
	}

	_root->_parent = nullptr;
  }
  void RotateR(Node* parent)
  {
	assert(parent);

	Node* subL = parent->_left;
	Node* subLR = subL->_right;

	parent->_left = subLR;
	if (subLR)
	  subLR->_parent = parent;
	Node* ppNode = parent->_parent;
	subL->_right = parent;
	parent->_parent = subL;
	if (ppNode == nullptr)
	{
	  _root = subL;
	  //subL->_parent = nullptr;
	}
	else
	{
	  if (ppNode->_left == parent)
	  {
		ppNode->_left = subL;
		subL->_parent = ppNode;
	  }
	  else
	  {
		ppNode->_right = subL;
		subL->_parent = ppNode;
	  }
	}

	_root->_parent = nullptr;


  }
  bool IsBalance()
  {
	if (_root && _root->_col == RED)
	  return false;
	size_t count = 0;
	Node* cur = _root;
	while (cur)
	{
	  if (cur->_col == BLACK)
	  {
		count++;
	  }
	  cur = cur->_left;
	}
	size_t k = 0;
	return _IsBalance(_root, count, k);
  }

  bool _IsBalance(Node* root, const size_t count, size_t k)
  {
	if (root == nullptr)
	{
	  if (count != k)
	  {
		cout << "黑节点数量不相等" << endl;
		return false;
	  }
	  return true;
	}
	if (root->_col == RED && root->_parent->_col == RED)
	{
	  return false;
	}
	if (root->_col == BLACK)
	  k++;
	return _IsBalance(root->_left, count, k) &&
	  _IsBalance(root->_right, count, k);
  }
  void Inorder()
  {
	_Inorder(_root);
	cout << endl;
  }
  void _Inorder(Node* root)
  {
	if (root == nullptr)
	{
	  return;
	}

	_Inorder(root->_left);
	cout << root->_key << " ";
	_Inorder(root->_right);
  }
private:
  Node* _root;
};
void TestRBTree()
{
  RBTree<int, int> rb;
  int a1[] = { 5, 3, 4, 1, 7, 8, 2, 6, 0, 9 };

  for (size_t i = 0; i < sizeof(a1) / sizeof(a1[0]); ++i)
  {
	rb.Insert(a1[i], i);
	std::cout << a1[i] << " " << rb.IsBalance() << std::endl;
  }
  rb.Inorder();
}

#include <queue>
#include <functional>
#include<vector>
using namespace std;
int main() {
  //TestRBTree();
  priority_queue<int,vector<int>,greater<>> pq;
  pq.push(20);
  pq.push(10);
  pq.push(30);
  cout << endl;
  while (!pq.empty())
  {
	cout << pq.top()<<" ";
	pq.pop();
  }
}