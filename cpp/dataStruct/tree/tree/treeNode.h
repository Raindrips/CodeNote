#include "Node.h"
class TreeNode :public Node {
	int val;
	std::vector <Node*> childs;
	Node* parent;
public:
	TreeNode(int val);
	~TreeNode();
	
	void addChild(Node* node) override;
	void removeChild(Node* node) override;
	void removeFromParent() override;

	std::any getVal();
	Node* getChild(int index)override;
	Node* getParent() override;
	std::vector<Node*>& getAllchildren() override;

	// Í¨¹ý Node ¼Ì³Ð
	virtual void setParent(Node* node) override;
	virtual std::string getName() override;
};