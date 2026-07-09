#include <stdio.h>

int main()
{
       int a[3][4],i,j,k;
	
	for(i=0;i<3;i++)
	{
		for(j=0;j<4;j++)
		{
			scanf("%d",&a[i][j]);
		}
	}

	for(i=0;i<3;i++)//i决定在哪一行中求最大
	{
		int i_max = a[i][0];
		for(j=0;j<4;j++)//j决定记录板与第i行的第几个元素比较
		{
			if(a[i][j] > i_max)
			{
				i_max = a[i][j];
			}
		}

		for(j=0;j<4;j++)
		{
			if(a[i][j] == i_max)//a[i][j]就是行中最大了,则判断是否是列中最小
			{
				for(k=0;k<3;k++)//k决定在j列中的哪一行的元素进行比较
				{
					if(a[k][j] < i_max)//如果有元素比i_max小，则i_max就不是最小
					{
						goto loop;
					}
				}
				printf("%d(%d,%d)\n",i_max,i,j);
				loop:;
			}
		}
	}
	
	return 0;
	
}
