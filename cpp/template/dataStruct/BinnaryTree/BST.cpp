#include <iostream>
#include <vector>

using namespace std;

template<class K, class V>
struct Node {
  K key;
  V val;
  Node* left;
  Node* right;
  Node(K& key, V& val) :key(key), val(val), left(nullptr), right(nullptr) {}
};

template<class K, class V>
class BST {
  int count;
  Node<K, V>* root;
public:
  BST() {
	count = 0;
	root = nullptr;
  }
  ~BST() {

  }
  int size() {
	return count;
  }

  bool empty() {
	return count == 0;
  }

  //查找
  bool operator==(K key) {
	return contain(root, key);
  }

  V& operator[](K key) {
	Node<K, V>* n = find(root, key);
	if (n == nullptr)
	  throw nullptr;

	return n->val;
  }

  Node<K, V>* find(Node<K, V>* node, K key) {
	if (node == nullptr) {
	  return nullptr;
	}
	if (key == node->key) {
	  return node;
	}
	if (key < node->key)
	  return find(node->left, key);
	else
	  return find(node->right, key);
  }

  bool contain(Node<K, V>* node, K key) {
	if (node == nullptr)
	  return false;
	if (node->key == key)
	  return true;

	if (key < node->key)
	  return contain(node->left, key);
	else
	  return contain(node->right, key);
	return true;
  }


  //插入
  void insert(K key, V val) {
	root = _insert(root, key, val);
  }

  Node<K, V>* _insert(Node<K, V>* pair, K key, V val) {
	if (pair == nullptr) {
	  count++;
	  return new Node<K, V>(key, val);
	}
	//如果重复,就修改元素value
	if (key == pair->key) {
	  pair->val = val;
	  return pair;
	}
	else if (key < pair->key) {
	  pair->left = _insert(pair->left, key, val);
	}
	else {
	  pair->right = _insert(pair->right, key, val);
	}
	return pair;
  }

  Node<K, V>* min() {
	return min(root);
  }
  //最小值
  Node<K, V>* min(Node<K, V>* node) {
	if (node->left == NULL)
	  return node;
	return min(node->left);
  }

  Node<K, V>* max() {
	return max(root);
  }
  //最大值
  Node<K, V>* max(Node<K, V>* node) {
	if (node->right == NULL)
	  return node;
	return max(node->right);
  }

  void pop_min()
  {
	if (root)
	  root = pop_min(root);
  }
  //移除最小值
  Node<K, V>* pop_min(Node<K, V>* node) {
	if (node->left == nullptr) {
	  Node<K, V>* temp = node->right;
	  delete node;
	  count--;
	  return temp;
	}
	node->left = pop_min(node->left);
	return node;
  }
  void pop_max() {
	if (root)
	{
	  root = pop_max(root);
	}
  }
  //移除最大值
  Node<K, V>* pop_max(Node<K, V>* node) {
	if (node->right == nullptr) {
	  Node<K, V>* temp = node->left;
	  delete node;
	  count--;
	  return temp;
	}
	node->right = pop_max(node->right);
	return node;
  }

  void out() {
	out(root);
  }
  void out(Node<K, V>* node) {
	if (node == nullptr) {
	  return;
	}
	cout << node->key << ":" << node->val << endl;
	out(node->left);
	out(node->right);
  }
  
	void remove(K key){
	   root = remove(root,key);
   }
  
	Node<K, V>* remove(Node<K, V>* node,K key){
	  if(node==nullptr){
		  return nullptr;
	  }
	  if(key<node->key){
		  node->left =remove(node->left,key);
		  return node;
	  }
	  else if(key>node->key){
		  node->right =remove(node->right,key);
		  return node;
	  }
		else{
			if(node->left==NULL){
			  Node<K, V>* temp =node->right;
			  count--;
			  delete node;
			  return temp;
		  }
		  if(node->right==NULL){
				Node<K, V>* temp =node->left;
				count--;
				delete node;
				return temp;
			}
			Node<K, V> *temp=min(node->right);
			node->key=temp->key;
			node->val=temp->val;
			node->right=pop_max(node->right);
			count--;
			return node;
		}
	}

private:

};

void test() {
  BST<int, char> bst;
  bst.insert(10, '1');
  bst.insert(20, '2');
  bst.insert(30, '3');
  bst.insert(40, '4');

  cout << bst.size() << endl;
  cout << boolalpha << (bst == 30) << endl;
  bst[10] = 'A';

  cout << bst[10] << endl;
  cout << bst[20] << endl;
  cout << bst[30] << endl;
  cout << bst[40] << endl;

  bst.out();

  cout << bst.min()->key << endl;
  cout << bst.max()->key << endl;

  bst.pop_max();
  bst.pop_min();

  cout << bst.min()->key << endl;
  cout << bst.max()->key << endl;
  
  bst.out();
}

int main() {
  test();	
}