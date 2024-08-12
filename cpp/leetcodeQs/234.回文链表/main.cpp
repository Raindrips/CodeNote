#include <iostream>
#include <vector>
#include <bits/stdc++.h>
using namespace std;
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    bool isPalindrome(ListNode* head) {
        
        deque<int> dq;
        for(auto t=head;t!=nullptr;t=t->next){
            dq.push_back(t->val);
        }
        if(dq.size()==1)
            return true;
        while(dq.size()>1){
            if(dq[0]!=dq.back()){
                return false;
            }
            dq.pop_back();
            dq.pop_front();					
        }
        return true; 
    }
};
int main()
{
		
	return 0;
}
