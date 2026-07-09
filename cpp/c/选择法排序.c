#include <stdio.h>



int main()
{
	int a[10],i,j,t;
	for(i=0;i<10;i++)
	{
		scanf("%d",&a[i]);
	}

	for(i=0;i<10;i++)//i决定哪一个元素作为记录板
	{
		for(j=i+1;j<10;j++)//j决定记录板与哪一个元素比较
		{
			if(a[j] < a[i])
			{
				t = a[i];//t保存的是将要被覆盖的值
				a[i] = a[j];
				a[j] = t;
			}
		}
	}

	for(i=0;i<10;i++)
	{
		printf("%d ",a[i]);
	}
	putchar('\n');
	return 0;
}
