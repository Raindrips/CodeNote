#include <stdio.h>
#include "calc.h"

extern struct data *expression;
extern int exp_index;
int flag_format_error = 0;//格式错误
extern char answer[256];

char itoc(int c)
{
	switch(c)
	{
		case 0: return '+';
		case 1: return '-';
		case 2: return '*';
		case 3: return '/';			
	}
}

float yunsuan(float a,float b,int i)
{	
	switch(i)
	{
		case 0:return a+b;
		case 1:return a-b;
		case 2:return a*b;
		case 3:return a/b;
	}
}

int jisuan(int a, int b, int c, int d)
{	
	int i,j,k;
	int flag = 0;
	float re1,re2,re3;
	
	for(i=0;i<4;i++)
	{
		re1 = yunsuan(a,b,i);
		/*方式一*/
		for(j=0;j<4;j++)//把后两个数先运算
		{
			re2 = yunsuan((double)c,(double)d,j);		
			for(k=0;k<4;k++)
			{
				re3 = yunsuan(re1,re2,k);
			
				if(re3 ==(double)24 )
				{				
					sprintf(answer,"(%d%c%d)%c(%d%c%d)\n",a,itoc(i),b,itoc(k),c,itoc(j),d);					
					flag = 1;
					printf("(%d%c%d)%c(%d%c%d)\n",a,itoc(i),b,itoc(k),c,itoc(j),d);
					return 1;
				}
			}			
		}		
		
		/*方式二*/
		for(j=0;j<4;j++)//连续运算
		{
			re2 = yunsuan(re1,c,j);		
			for(k=0;k<4;k++)
			{
				re3 = yunsuan(re2,d,k);			
				if(re3 ==(double)24 )
				{
					sprintf(answer,"((%d%c%d)%c%d)%c%d\n",a,itoc(i),b,itoc(j),c,itoc(k),d);
					flag = 1;
					printf("((%d%c%d)%c%d)%c%d\n",a,itoc(i),b,itoc(j),c,itoc(k),d);
					return 1;
				}
				
				re3 = yunsuan(d,re2,k);			
				if((re3 ==(double)24) && k!=0 && k!=2)
				{
					sprintf(answer,"%d%c((%d%c%d)%c%d)\n",d,itoc(k),a,itoc(i),b,itoc(j),c);
					flag = 1;
					printf("%d%c((%d%c%d)%c%d)\n",d,itoc(k),a,itoc(i),b,itoc(j),c);
					return 1;
				}	
			}
			
			re2 = yunsuan(c,re1,j);			
			if(j!=0 && j!=2)
			{	
				for(k=0;k<4;k++)
				{
					re3 = yunsuan(re2,d,k);				
					if(re3==(double)24 )
					{
						sprintf(answer,"(%d%c(%d%c%d))%c%d\n",c,itoc(j),a,itoc(i),b,itoc(k),d);
						flag = 1;
						printf("(%d%c(%d%c%d))%c%d\n",c,itoc(j),a,itoc(i),b,itoc(k),d);
						return 1;
					}	
					
					re3 = yunsuan(d,re2,k);				
					if((re3==(double)24) && k!=0 && k!=2)
					{
						sprintf(answer,"%d%c(%d%c(%d%c%d))\n",d,itoc(i),c,itoc(j),a,itoc(k),b);
						flag = 1;
						printf("%d%c(%d%c(%d%c%d))\n",d,itoc(i),c,itoc(j),a,itoc(k),b);
						return 1;
	}	}	}	}	}	
	
	return flag;
}

int find_answer(int *n)
{
	int save[24][4]={0};//位置保存数组
	int in_save = 0;

	int i,j,k,l,t;
	int flag_answer = 0;

	/*  把数字换位置  */
	
	int flag_a[4]={0};//0表示没取过，1表示取过了
	int count =0 ;
	for(i=0;i<4;i++)
	{
		if(flag_a[i]==0)
		{
			flag_a[i] = 1;
		
			int flag_b[4]={0};
			for(j=0;j<4;j++)
			{
				if(j != i && flag_b[j] == 0)
				{
					flag_b[j] = 1;
				
					int flag_c[4]={0};
					for(k=0;k<4;k++)
					{
						if(k != i && k != j && flag_c[k]==0)
						{
							flag_c[k] = 1;
						
							int flag_d[4]={0};
							for(l=0;l<4;l++)
							{
								if(l != i && l != j && l != k && flag_d[l] == 0 )
								{
									flag_d[l] = 1;
									int flag_save = 1;			
									int num[4];
									num[0]=n[i];
									num[1]=n[j];
									num[2]=n[k];
									num[3]=n[l];
									
									int t1,t2,t3;
									for(t1=0;t1<in_save;t1++)//验证num数组是否与save组的某一行相同
									{
										for(t2=0;t2<4;t2++)
										{
											if(save[t1][t2] != num[t2])//有一个不同，就验证下一行
											{
												goto loop;												
											}
										}										
										flag_save = 0;//有一行相同，就把flag_save置0，并退出循环
										break;
										loop:;										
									}	
									
									if(flag_save == 1)//如果与之前的不同就计算，并把数字保存在save数组里
									{										
										if(jisuan(n[i],n[j],n[k],n[l]))
										{
											flag_answer = 1;
										}	
										
										for(t3=0;t3<4;t3++)
										{
											save[in_save][t3]=num[t3];
										}
										in_save++;									
	}	}	}	}	}	}	}	}	}
	
	if(flag_answer == 0)
	{
		//printf("no answer!\n");		
		return -1;
	}
	return 0;
}
int find_index(struct data* str,int start,int end,int cur,int *left,int *right)
{
	int i = 0,flag_l=0,flag_r=0,flag_start=0,flag_end=0;
	while(1)
	{
		if(flag_l==0 && str[cur-i].mod == 2)
		{
			*left =  cur-i;
			flag_l = 1;
		}
		if(flag_r==0 && str[cur+i].mod == 2)
		{
			*right = cur+i;
			flag_r = 1;			
		}
		if(flag_l && flag_r)
		{
			return 0;
		}
		
		if(cur-i == start)
		{
			flag_start = 1;
		}
		if(cur+i == end)
		{
			flag_end = 1;
		}
		if(cur-i==start && flag_l==0 || cur+i==end && flag_r==0)
		{
			flag_format_error = 1;
			return -1;
		}
		if(flag_start && flag_end)
		{
			return 0;
		}
		i++;
	}
}
float calc(struct data* str,int start,int end)//计算式子
{
	int i,r,index_l,index_r;
	
	for(i=start; i<=end; i++)
	{
		if(str[i].mod == 1 )
		{
			if(str[i].opr == '*')
			{
				r =find_index(str,start,end,i,&index_l,&index_r);
				if(r == -1)
					return -1;
				str[index_l].num = yunsuan(str[index_l].num,str[index_r].num,2);
				str[i].mod = 0;
				str[index_r].mod = 0;
			}
			else if(str[i].opr == '/')
			{
				r =find_index(str,start,end,i,&index_l,&index_r);
				if(r == -1)
					return -1;
				str[index_l].num = yunsuan(str[index_l].num,str[index_r].num,3);
				str[i].mod = 0;
				str[index_r].mod = 0;
			}			
		}
	}
	
	for(i=start; i<=end; i++)
	{
		if(str[i].mod == 1 )
		{
			if(str[i].opr == '+')
			{
				r = find_index(str,start,end,i,&index_l,&index_r);
				if(r == -1)
					return -1;
				str[index_l].num = yunsuan(str[index_l].num,str[index_r].num,0);
				str[i].mod = 0;
				str[index_r].mod = 0;
			}
			else if(str[i].opr == '-')
			{
				r=find_index(str,start,end,i,&index_l,&index_r);
				if(r == -1)
					return -1;
				str[index_l].num = yunsuan(str[index_l].num,str[index_r].num,1);
				str[i].mod = 0;
				str[index_r].mod = 0;
			}			
		}
	}	
}

int judge_answer(struct data* str)//返回0:正确,返回-1:错误,返回-2:格式错误
{
	float re1,re2,re3;
	int start=0,end=0;
	int flag=0;//出现左括号标志位
	int i=0,j=0,r;
	while(1)
	{	
		if(str[i].mod == 1)//是字符单位
		{
			if(str[i].opr == '(')
			{
				start = i;
				str[i].mod = 0;
				flag++;
			}
			else if(str[i].opr == ')')
			{
				if(flag > 0)
				{
					end = i;
					str[i].mod = 0;
					r = calc(str,start,end);
					if(r == -1)
						return -2;
					start = end = 0;
					flag--;
					i = 0;
					continue;
				}
				else
				{
					return -2;//式子括号不匹配
				}
			}
			else if(str[i].opr == '$')//到末尾了
			{
				if(flag == 0)
				{
					r = calc(str,0,i-1);
					if(r == -1)
						return -2;
					while(j<i)
					{
						if(str[j].mod == 2)
						{
							if(str[j].num == (double)24)
								return 0;
							else
								return -1;//答案错误
						}
						j++;
					}
					return -2;
				}
				else
				{
					return -2;//式子括号不匹配
				}
			}
		}		
		i++;
	}
	return 0;
}

