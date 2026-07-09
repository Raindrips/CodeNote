
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h> /*perror, errno ,...*/
#include <stdlib.h>/*abs的头文件*/
#include <stdio.h> /*printf*/
#include <sys/mman.h>
#include "lcd.h"
#include "model.h"
#include "calc.h"

extern struct data expression[32];
extern int exp_index;
extern int num24[4];
extern char answer[256];

int *plcd = NULL;
int fb;

int lcd_init()
{
	/*step 1: 打开屏幕*/
	fb = open("/dev/fb0", O_RDWR);
	if (fb == -1)
	{
		perror("open fb0 failed:");
		return -1;
	}	
	/*step 2: mmap*/
	plcd = mmap(NULL, 800*480*4, PROT_WRITE, MAP_SHARED, fb,0);
	return 0;	
}

int lcd_uninit()
{
	munmap(plcd, 800*480*4);
	close(fb);
	return 0;	
}
void lcd_draw_point(int x, int y, int color)
{
	int *p = plcd;

	if (x >= 0 && x < 800 && y>=0 && y <480)
	{
		*(p + 800*y + x) = color;
	}
}

/*
	lcd_draw_rectangle: 在屏幕上画一个矩形，并且用
		color这种颜色填充该矩形。
	@x0: 该矩形的中心点的x轴坐标
	@y0:该矩形的中心点的y轴坐标
	@w:该矩形的宽
	@h:该矩形的高
	@color:该矩形要填充的辨色值

	返回值:
		无返回值。		
*/
void lcd_draw_rectangle(int x0, int y0, int w, int h, int color)
{

	int x, y;

	for (y = y0-h/2; y < y0 + h/2; y++)
	{
		for (x = x0-w/2; x < x0 + w/2; x++)
		{
			lcd_draw_point(x, y  , color);
		}
	}
}

/*
	lcd_draw_trangle: 在屏幕上画一个直角三角形，并且用
		color这种颜色填充该矩形。
	@y1: 该三角形高的较小坐标
	@y2: 该三角形高的较大坐标
	@w:  该三角形的宽，>0向右，<0向左
	@mod: mod>0顶点朝上，mod<0顶点朝下
	@color:该直角三角形要填充的辨色值

	返回值:
		无返回值。		
*/
void lcd_draw_triangle(int y1,int y2,int x,int w,int mod,int color)
{
	
	int i,j,h=y2-y1;
	for(i=0;i<=abs(w);i++)
	{
		for(j=h;j>=0;j--)
		{
			if(w>0)
			{
				if(j <= 1.0*(w-i)*h/w)
				{
					if(mod==0)//0为顶点在上，1为顶点在下
						lcd_draw_point(x+i,y2-j,color);
					else
						lcd_draw_point(x+i,y1+j,color); 
				}
			}
			else
			{
				if(j <= 1.0*abs(w+i)*h/(-w))
				{
					if(mod==0)
						lcd_draw_point(x-i,y2-j,color);
					else
						lcd_draw_point(x-i,y1+j,color);
				}
			}
		}
	}
}

void lcd_draw_circle(int x0,int y0,int r,int color)//画圆
{
	int i,j;
	for(i=x0-r;i<=x0+r;i++)
	{
		for(j=y0-r;j<=y0+r;j++)
		{
			if((i-x0)*(i-x0) + (j-y0)*(j-y0) <= r*r)
			{
				lcd_draw_point(i,j,color);
			}
		}
	}
}
void lcd_draw_ellipse(int x0,int y0,int a,int b,int color)//画椭圆
{
	int i,j;
	for(i=x0-a;i<=x0+a;i++)
	{
		for(j=y0-b;j<=y0+b;j++)
		{
			if(1.0*(i-x0)*(i-x0)/(a*a) + 1.0*(j-y0)*(j-y0)/(b*b) <= 1)
			{
				lcd_draw_point(i,j,color);
			}
		}
	}
}

void lcd_draw_diamonds(int x0,int y0,int size,int color)//画方块
{
	lcd_draw_triangle(y0-2*size,y0,x0,1.2*size,0,color);//右上
	lcd_draw_triangle(y0-2*size,y0,x0,-1.2*size,0,color);//左上
	lcd_draw_triangle(y0,y0+2*size,x0,1.2*size,1,color);//右下
	lcd_draw_triangle(y0,y0+2*size,x0,-1.2*size,1,color);//左下
} 

void lcd_draw_spade(int x0,int y0,int size,int color)//画黑桃
{
	//根号3为1.732
	lcd_draw_triangle(y0-2*size,y0,x0,1.732*size,0,color);//右上
	lcd_draw_triangle(y0-2*size,y0,x0,-1.732*size,0,color);//左上
	lcd_draw_triangle(y0,y0+size,x0,1.732*size,1,color);//右下
	lcd_draw_triangle(y0,y0+size,x0,-1.732*size,1,color);//左下
	
	lcd_draw_circle(x0-0.866*size,y0+0.5*size,size,color);
	lcd_draw_circle(x0+0.866*size,y0+0.5*size,size,color);
	
	lcd_draw_triangle(y0+size,y0+2*size,x0,size/1.5,0,color);//右上
	lcd_draw_triangle(y0+size,y0+2*size,x0,-size/1.5,0,color);//左上	
}

void lcd_draw_hearts(int x0,int y0,int size,int color)//画红桃
{
	lcd_draw_triangle(y0,y0+2*size,x0,1.732*size,1,color);//右下
	lcd_draw_triangle(y0,y0+2*size,x0,-1.732*size,1,color);//左下
	lcd_draw_triangle(y0-size,y0,x0,1.732*size,0,color);//右上
	lcd_draw_triangle(y0-size,y0,x0,-1.732*size,0,color);//左上
	
	lcd_draw_circle(x0-0.866*size,y0-0.5*size,size,color);
	lcd_draw_circle(x0+0.866*size,y0-0.5*size,size,color);
}

void lcd_draw_club(int x0,int y0,int size,int color)//画梅花
{
	lcd_draw_circle(x0,y0-size,size,color);
	lcd_draw_rectangle(x0,y0,size/2,2*size,color);
	lcd_draw_circle(x0-size-size/4,y0+size/4,size,color);
	lcd_draw_circle(x0+size+size/4,y0+size/4,size,color);
	
	lcd_draw_triangle(y0+size/2,y0+2*size,x0,size,0,color);//右下
	lcd_draw_triangle(y0+size/2,y0+2*size,x0,-size,0,color);//左下
}



void lcd_draw_word(int x0,int y0,int w,int h,char *data,int color)
{
	int i,k;
	
	for(i=0;i<w*h/8;i++)
	{
		for(k=0;k<8;k++)
		{
			if((data[i]<<k )&0x80)
			{
				lcd_draw_point(x0+((i*8+k)>w?(i*8+k)%w:(i*8+k)),y0+i/(w/8),color);
			}
		}			
	}
}

void draw_UI0()//画主菜单界面
{
	int i;
	lcd_draw_rectangle(400, 240, 800,480, 0x6b8e23);//画背景
	
	lcd_draw_rectangle(400, 150, 400,200,0x9932cc);//画四边形
	lcd_draw_triangle(50,250,200,-100,0,0x9932cc);//左上
	lcd_draw_triangle(50,250,600,100,1,0x9932cc);//右下
	
	lcd_draw_word(100,150,96,99,word_big[0],0x8b2323);//速
	lcd_draw_word(200,150,96,99,word_big[1],0x8b2323);//算
	lcd_draw_word(350,150,96,99,word_big[2],0x8b2323);//2
	lcd_draw_word(400,150,96,99,word_big[3],0x8b2323);//4
	lcd_draw_word(500,150,96,99,word_big[4],0x8b2323);//点
	
	lcd_draw_spade(300,300,10,0xcd00cd);//画黑桃
	lcd_draw_hearts(300,400,10,0xcd00cd);//画红桃
	for(i=0;i<4;i++)
	{
		lcd_draw_word(350+i*50,300,32,32,word_min[i],0xcd00cd);//练习模式
		lcd_draw_word(350+i*50,400,32,32,word_min[4+i],0xcd00cd);//挑战模式
	}
	
}

void draw_UI1()//画练习模式界面
{
	int i;
	lcd_draw_rectangle(400, 240, 800,480, 0x6b8e23);//画背景
	for(i=0;i<4;i++)
	{
		lcd_draw_rectangle(100+i*200, 150, 120,168, 0x8b6508);//画牌
	}
	
	lcd_draw_diamonds(100,150,10,0xff0000);//画方块
	lcd_draw_spade(300,150,10,0xff0000);//画黑桃
	lcd_draw_hearts(500,150,10,0xff0000);//画红桃
	lcd_draw_club(700,150,10,0xff0000);//画梅花

	int A1,A2;
	for(i=0;i<4;i++)//画牌点
	{
		A1=num24[i]%10;
		A2=num24[i]/10;
		lcd_draw_word(45+i*200,70,16,33,mod_num[A2],0xff0000);
		lcd_draw_word(65+i*200,70,16,33,mod_num[A1],0xff0000);
	}
	
	for(i=0;i<6;i++)//画运算符
	{
		lcd_draw_rectangle(260+i*60+8,315,50,40, 0x8b6508);
	}
	lcd_draw_word(260,300,16,33,mod_char['+'-40],0xff0000);
	lcd_draw_word(320,300,16,33,mod_char['-'-40],0xff0000);
	lcd_draw_word(380,300,16,33,mod_char['*'-40],0xff0000);
	lcd_draw_word(440,300,16,33,mod_char['/'-40],0xff0000);
	lcd_draw_word(500,300,16,33,mod_char['('-40],0xff0000);
	lcd_draw_word(560,300,16,33,mod_char[')'-40],0xff0000);
	
	lcd_draw_rectangle(415,400,480,100, 0xcd1076);//画答题区
	
	lcd_draw_ellipse(710,320,50,17,0x0000ee);//画提交按钮
	lcd_draw_word(660,300,16,33,letter['s'-97],0xff0000);
	lcd_draw_word(678,300,16,33,letter['u'-97],0xff0000);
	lcd_draw_word(696,300,16,33,letter['b'-97],0xff0000);
	lcd_draw_word(714,300,16,33,letter['m'-97],0xff0000);
	lcd_draw_word(732,300,16,33,letter['i'-97],0xff0000);
	lcd_draw_word(750,300,16,33,letter['t'-97],0xff0000);
	
	lcd_draw_ellipse(710,370,50,17,0x0000ee);//画清除按钮
	lcd_draw_word(670,350,16,33,letter['c'-97],0xff0000);
	lcd_draw_word(688,350,16,33,letter['l'-97],0xff0000);
	lcd_draw_word(706,350,16,33,letter['e'-97],0xff0000);
	lcd_draw_word(724,350,16,33,letter['a'-97],0xff0000);
	lcd_draw_word(744,350,16,33,letter['r'-97],0xff0000);

	lcd_draw_ellipse(710,420,50,17,0x0000ee);//画下一题按钮
	lcd_draw_word(680,400,16,33,letter['n'-97],0xff0000);
	lcd_draw_word(698,400,16,33,letter['e'-97],0xff0000);
	lcd_draw_word(716,400,16,33,letter['x'-97],0xff0000);
	lcd_draw_word(734,400,16,33,letter['t'-97],0xff0000);
		
}

void draw_UI2()//画挑战模式界面
{

}

void print_expr()
{printf("%s %d\n",__FUNCTION__,__LINE__);
	int i=0,j=0;
	while(j<exp_index)
	{
		if(expression[j].mod == 1)//字符
		{
			switch(expression[j].opr)
			{
				case '(':
					lcd_draw_word(220+i*20,400,16,33,mod_char['('-40],0xeeee00);
					break;
				case ')':
					lcd_draw_word(220+i*20,400,16,33,mod_char[')'-40],0xeeee00);
					break;
				case '+':
					lcd_draw_word(220+i*20,400,16,33,mod_char['+'-40],0xeeee00);
					break;
				case '-':
					lcd_draw_word(220+i*20,400,16,33,mod_char['-'-40],0xeeee00);
					break;
				case '*':
					lcd_draw_word(220+i*20,400,16,33,mod_char['*'-40],0xeeee00);
					break;
				case '/':
					lcd_draw_word(220+i*20,400,16,33,mod_char['/'-40],0xeeee00);
					break;					
			}
			i++;
			j++;
		}
		else if(expression[j].mod == 2)
		{
			if(expression[j].num >= 10)
			{
				int A2 = (int)expression[j].num/10;
				int A1 = (int)expression[j].num%10;
				lcd_draw_word(220+i*20,400,16,33,mod_num[A2],0xeeee00);
				i++;
				lcd_draw_word(220+i*20,400,16,33,mod_num[A1],0xeeee00);	
				i++;
			}
			else
			{
				lcd_draw_word(220+i*20,400,16,33,mod_num[(int)(expression[j].num)],0xeeee00);
				i++;
			}
			j++;
		}
	}
}

void print_answer()
{
	int i=0;
	lcd_draw_rectangle(400,300,400,200, 0xcdcd00);
	lcd_draw_rectangle(400,300,390,190, 0xd2691e);
	
	while(answer[i]!='\0')
	{
		if(answer[i]>='0' && answer[i]<='9')
		{
			lcd_draw_word(250+i*20,300,16,33,mod_num[answer[i]-48],0xeeee00);
		}
		else
		{
			lcd_draw_word(250+i*20,300,16,33,mod_char[answer[i]-40],0xeeee00);
		}
		i++;
	}
}
void print_right()
{
	lcd_draw_rectangle(400,300,400,200, 0xcdcd00);
	lcd_draw_rectangle(400,300,390,190, 0xd2691e);
	lcd_draw_word(300,300,16,33,letter['r'-97],0xeeee00);
	lcd_draw_word(320,300,16,33,letter['i'-97],0xeeee00);
	lcd_draw_word(340,300,16,33,letter['g'-97],0xeeee00);
	lcd_draw_word(360,300,16,33,letter['h'-97],0xeeee00);
	lcd_draw_word(380,300,16,33,letter['t'-97],0xeeee00);
}
void print_wrong()
{
	lcd_draw_rectangle(400,300,400,200, 0xcdcd00);
	lcd_draw_rectangle(400,300,390,190, 0xd2691e);
	lcd_draw_word(300,300,16,33,letter['w'-97],0xeeee00);
	lcd_draw_word(320,300,16,33,letter['r'-97],0xeeee00);
	lcd_draw_word(340,300,16,33,letter['o'-97],0xeeee00);
	lcd_draw_word(360,300,16,33,letter['n'-97],0xeeee00);
	lcd_draw_word(380,300,16,33,letter['g'-97],0xeeee00);
}
void print_formaterror()
{
	lcd_draw_rectangle(400,300,400,200, 0xcdcd00);
	lcd_draw_rectangle(400,300,390,190, 0xd2691e);
	lcd_draw_word(300,300,16,33,letter['f'-97],0xeeee00);
	lcd_draw_word(320,300,16,33,letter['o'-97],0xeeee00);
	lcd_draw_word(340,300,16,33,letter['r'-97],0xeeee00);
	lcd_draw_word(360,300,16,33,letter['m'-97],0xeeee00);
	lcd_draw_word(380,300,16,33,letter['a'-97],0xeeee00);
	lcd_draw_word(400,300,16,33,letter['t'-97],0xeeee00);
	
	lcd_draw_word(440,300,16,33,letter['e'-97],0xeeee00);
	lcd_draw_word(460,300,16,33,letter['r'-97],0xeeee00);
	lcd_draw_word(480,300,16,33,letter['r'-97],0xeeee00);
	lcd_draw_word(500,300,16,33,letter['o'-97],0xeeee00);
	lcd_draw_word(520,300,16,33,letter['r'-97],0xeeee00);
}
