#include<stdio.h>
#define N 100
int main()
{
	int i,j,n,t=1;
	int a[2][N]={0};
	printf("please enter hangshu:\n");
	scanf("%d",&n);
	a[0][0]=1;
	a[1][0]=1;
	
	printf("1\n");//打印第一行
	for(i=1;i<n;i++)
	{
		printf("1\t");//打印每一行的第一个1
		for(j=1;j<=i;j++)
		{
			a[t][j]=a[!t][j-1]+a[!t][j];
			printf("%d\t",a[t][j]);
		}
		putchar('\n');
		t = !t;
	}
	
	return 0;
}