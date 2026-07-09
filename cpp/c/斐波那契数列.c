#include <stdio.h>
#define MAX_N  100
int main()
{
	int a[MAX_N]={0},n,i,sum=0;
	scanf("%d",&n);

	a[0]=a[1]=1;

	for(i=0;i<n;i++)
	{
		a[i+2] = a[i]+a[i+1];
		sum += a[i];
	}

	printf("sum is %d\n",sum);
	return 0;
}
