#include <iostream>
#include <vector>
using namespace std;

//反转一个单链表。

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if(head==nullptr)
			return nullptr;
		ListNode* pre=nullptr;
		ListNode* next=nullptr;
		ListNode* cur=head;
		
		while(cur!=nullptr){
			next=cur->next;

			cur->next=pre;
			pre=cur;
			cur=next;
		}
		return pre;
    }
};

int main()
{
	
	return 0;
}
