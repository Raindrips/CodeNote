#include<iostream>
struct ListNode {
  int val;
  ListNode* next;
  ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
  ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
	if (l1 == nullptr) {
	  return l2;
	}
	else if (l2 == nullptr) {
	  return l1;
	}
	else if (l1->val < l2->val) {
	  l1->next = mergeTwoLists(l1->next, l2);
	  return l1;
	}
	else {
	  l2->next = mergeTwoLists(l1, l2->next);
	  return l2;
	}
  }
};

void print(ListNode* l) {
  while (l) {
	std::cout << l->val << "->";
	l = l->next;
  }
  std::cout << "null" << std::endl;
}

void test() {
  ListNode* n1 = new ListNode(1);
  ListNode* n2 = new ListNode(3);
  ListNode* n3 = new ListNode(5);

  ListNode* l1 = new ListNode(2);
  ListNode* l2 = new ListNode(4);
  ListNode* l3 = new ListNode(6);

  n1->next = n2;
  n2->next = n3;

  l1->next = l2;
  l2->next = l3;

  print(n1);
  print(l1);
  Solution s;
  ListNode *t = s.mergeTwoLists(n1, l1);
  print(t);
}