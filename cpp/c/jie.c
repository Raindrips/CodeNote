#include <stdio.h>
/*
	int jie(int n)
	功能:返回n的阶乘		
*/

int jie(int n)
{
	if(n == 1)
	{
		return 1;
	}
	return n*jie(n-1);
}

int main()
{
	int n;
	scanf("%d",&n);
	
	printf("value is %d\n",jie(n));

	return 0;
}
