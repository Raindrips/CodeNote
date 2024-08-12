#include <stdio.h>
#include <ctype.h>

/*要将"China"译成密码，译码规律是：用原来字母后面的第4个字母代替原来的字母．

例如，字母"A"后面第4个字母是"E"．"E"代替"A"。因此，"China"应译为"Glmre"。

请编一程序，用赋初值的方法使cl、c2、c3、c4、c5五个变量的值分别为，’C’、’h’、’i’、’n’、’a’，经过运算，使c1、c2、c3、c4、c5分别变为’G’、’l’、’m’、’r’、’e’，并输出。
*/
void encrypt(char* a) {
  int offset = 4;
  for (char* p = a; *p != '\0'; p++)
  {
	int a;
	if (isupper(p[0]))
	{
	  a = (p[0] - 'A' + offset) % 26;
	  p[0] = a + 'A';
	}
	else
	{
	  a = (p[0] - 'a' + offset) % 26;
	  p[0] = a + 'a';
	}
  }
}
int main1()
{
  char c[1024];
  //scanf("%s", c);
  encrypt(c);
  printf("%s", c);
  return 0;
}
