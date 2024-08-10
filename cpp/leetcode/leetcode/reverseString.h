#pragma once
#include <string>

using namespace std;

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
class Solution {
public:
  struct ListNode* swapPairs(struct ListNode* head) {

  }
  void swapWord(char *word) {
	int l = 0,r=0;
	int top=0;
	char str[10][10] = {0};
	while (word[l] != '\0')
	{
	  while (word[r] != ' ')
		r++;
	  int i = 0;
	  for (; l < r; i++, l++)
	  {
		str[top][i] = word[l];
	  }
	  str[top][i] = '\0';
	  printf("%s\n", str[top]);
	  top++;
	  l = r;
	}
  }
};

void test() {
  Solution s;
  char str[20] = "hello world is size";
  s.swapWord(str);
}