#include <stdio.h>

int print(int a,int n)//a是第一个数，n是个数
{
	n--;
	while(n--)
	{
		printf("%d+",a++);		
	}
	printf("%d\n",a);	
}

int main()
{
	int n,i;
	scanf("%d",&n);
	
	for(i=2;i*i+i<=2*n;i++)//i代表的是分解的个数
	{
		if((n-(1+i)*i/2)%i == 0)//是可以分解的
			print(n/i-i/2+1-i%2,i);
	}
	
}

/*
	作业:求最佳选取方式
	现在有5个物品,A,B,C,D,E，输入这五个物品的价值vA,vB,vC,vD,vE
	再输入一个期望价值vEX。每个物品只能选一次，可以不选。
	求最佳选取方式使总价值最接近期望价值。
	
	提示:
		穷举法
		求最值
		二进制
*/








