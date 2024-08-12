#include <iostream>
#include <vector>
using namespace std;

/*
反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。

说明:
1 ≤ m ≤ n ≤ 链表长度。
*/

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};
ListNode* creatLinkedList(int arr[],int n){
	if(n==0)
	{
		return nullptr;
	}
	ListNode* head=new ListNode(arr[0]); 
	
}

class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int m, int n) {
        
    }
};


int main()
{
	
	return 0;
}
