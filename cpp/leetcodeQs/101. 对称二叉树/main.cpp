#include <iostream>
#include <vector>
#include <bits/stdc++.h>

using namespace std;

//Definition for a binary tree node.
struct TreeNode
{
	int val;
	TreeNode *left;
	TreeNode *right;
	TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
class Solution
{
public:

	bool isSymmetric(TreeNode *root)
	{
		queue<TreeNode*> q1;
		queue<TreeNode*> q2;
		
		q1.push(root);
		q2.push(root);

		while(!q1.empty() || !q2.empty()){
			TreeNode* v1=q1.front(); q1.pop();
			TreeNode* v2=q2.front(); q2.pop();
			if(!v1 && !v2){
				continue;
			}
			if((!v1 || !v2)||v1->val!=v2->val){
				return false;
			}			
			q1.push(v1->left);
			q2.push(v2->right);
			q1.push(v1->right);
			q2.push(v2->left);
			
		}
		return true;
	}

	bool _isSymmetric(TreeNode *root)
	{
		return check(root, root);
	}
	
	bool check(TreeNode *p, TreeNode *q)
	{
		if (!p && !q)
			return true;
		if (!p || !q)
			return false;

		return 
			p->val == q->val && 
			check(p->left, q->right) && 
			check(p->right, q->left);
	}
};

int main()
{
	Solution s;
	TreeNode *root = new TreeNode(0);
	TreeNode *l1 = new TreeNode(1);
	TreeNode *r1 = new TreeNode(1);
	TreeNode *l2 = new TreeNode(3);
	TreeNode *r2 = new TreeNode(4);
	TreeNode *rl2 = new TreeNode(4);
	TreeNode *rr2 = new TreeNode(3);

	root->left = l1;
	root->right = r1;

	l1->left = l2;
	l1->right = r2;

	r1->left = rl2;
	r1->right = rr2;

	cout << boolalpha << s.isSymmetric(root) << endl;
	return 0;
}
