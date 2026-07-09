#include <stdio.h>
/*
	a1=10,  an =an-1 + 2;
	(1)求第n项的值
	(2)求前n项的和
	
*/

/*
	int An(int n)
	功能:返回第n项的值
*/
int An(int n)
{
	if(n == 1)
	{
		return 10;
	}
	return An(n-1)+2;
}

/*
	int Sn(int n)
	功能:返回前n项的和
*/
int Sn(int n)
{
	if(n==1)
	{
		return An(1);
	}
	return Sn(n-1) + An(n);
}

int main()
{
	int n;
	scanf("%d",&n);
	
	printf("An is %d,Sn is %d\n",An(n),Sn(n));
	return 0;
}
