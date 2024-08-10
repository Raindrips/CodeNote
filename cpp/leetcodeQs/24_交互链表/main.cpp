#include <iostream>
#include <vector>
#include <bits/stdc++.h>
using namespace std;
/**
 * Definition for singly-linked list.

 */
struct ListNode
{
	int val;
	ListNode *next;
	ListNode() : val(0), next(nullptr) {}
	ListNode(int x) : val(x), next(nullptr) {}
	ListNode(int x, ListNode *next) : val(x), next(next) {}
};
class Solution
{
public:
	ListNode *swapPairs(ListNode *head)
	{
		ListNode *tmp = new ListNode(-1);
		tmp->next = head;
		ListNode *p = tmp;
		while (p->next && p->next->next)
		{
			ListNode *tmp1 = p->next;
			ListNode *tmp2 = tmp1->next;
			ListNode *next = tmp2->next;

			tmp2->next = tmp1;
			tmp1->next = next;
			p->next = tmp2;

			p = tmp1;
		}
		head = tmp->next;
		delete tmp;
		return head;
	}

	//递归写法
	ListNode *_swapPairs(ListNode *head)
	{
		if (head == nullptr || head->next == nullptr)
		{
			return head;
		}
		ListNode *next = head->next;
		head->next = _swapPairs(next.next);
		next->next = head;
		return next;
	}
};
int main()
{
	
	return 0;
}
