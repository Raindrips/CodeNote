#pragma once
#include <stdio.h>
#include <string.h>
class Solution {
public:
  char* reverser(char* word) {
	int len = 0;
	while (word[len] != '\0' && word[len] != ' ')
	  len++;
	if (len == 0)
	  return NULL;
	int  i = 0, j = len - 1;
	while (i < j)
	{
	  char c = word[i];
	  word[i] = word[j];
	  word[j] = c;
	  j--;
	  i++;
	}
	return word + len + 1;
  }

  void reveserPhrase(char* phrase) {
	do {
	  phrase = reverser(phrase);
	} while (phrase);
  }

};

void test() {
  Solution s;
  char str[100] = "holle world here i come ";
  printf("%s\n", str);
  s.reveserPhrase(str);
  printf("%s\n", str);
}

void test2() {
  char phrase[100] = "holle world here i come ";
  do {
	char* word= phrase;
	int len = 0;
	while (word[len] != '\0' && word[len] != ' ')
	  len++;
	if (len == 0)
	  break;
	int  i = 0, j = len - 1;
	while (i < j)
	{
	  char c = word[i];
	  word[i] = word[j];
	  word[j] = c;
	  j--;
	  i++;
	}
	word = word + len + 1;
  } while (phrase);
}