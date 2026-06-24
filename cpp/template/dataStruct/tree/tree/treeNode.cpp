#include "treeNode.h"
#include <stack>
#include <any>
using namespace std;
TreeNode::TreeNode(int val)
	:val(val), parent(nullptr)
{
}

TreeNode::~TreeNode()
{
}

void TreeNode::addChild(Node* node)
{
	node->setParent(this);
	childs.push_back(node);
}

void TreeNode::removeChild(Node* node)
{
	childs.erase(find(childs.begin(), childs.end(), node));
}

void TreeNode::removeFromParent()
{
	this->getParent()->removeChild(this);
	delete this;
}

any TreeNode::getVal()
{
	return make_any<int>(val);
}

Node* TreeNode::getChild(int index)
{
	return childs[index];
}

Node* TreeNode::getParent()
{
	return parent;
}

vector<Node*>& TreeNode::getAllchildren()
{
	return childs;
}

void TreeNode::setParent(Node* node)
{
	this->parent=node;
}

std::string TreeNode::getName()
{
	return "TreeNode "+to_string(val);
}
