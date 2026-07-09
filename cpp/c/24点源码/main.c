
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h> /*perror, errno ,...*/
#include <stdlib.h>/*abs的头文件*/
#include <stdio.h> /*printf*/
#include <linux/input.h>
#include <time.h> /*time */
#include <string.h>
#include "lcd.h"
#include "calc.h"

struct data expression[32]={0};//输入表达式数组
int exp_index = 0;//输入表达式数组下标
char answer[256]={0};//答案表达式
int num24[4];
int flag_num[4] = {0};//数字选中标志
int score = 0;//分数
int flag_timeout = 0;
int UI_mod = 0;//0为主菜单界面，1为练习模式界面，2为挑战模式界面

int exe_menu()
{
	UI_mod = 0;
	draw_UI0();
}
int exe_prat()
{
	UI_mod = 1;
	memset(expression,0,sizeof(expression));
	memset(flag_num,0,sizeof(flag_num));
	memset(answer,0,sizeof(answer));
	exp_index = 0;
	get_new_question();	
	draw_UI1();
}
int exe_chal()
{
	UI_mod = 2;
}
int get_new_question()
{
	int n[4];
	while(1)
	{
		n[0] = (random()%2)*10 + random()%9;
		n[1] = (random()%2)*10 + random()%9;
		n[2] = (random()%2)*10 + random()%9;
		n[3] = (random()%2)*10 + random()%9;
		if(find_answer(n) == 0)
		{
			num24[0] = n[0];
			num24[1] = n[1];
			num24[2] = n[2];
			num24[3] = n[3];
			break;
		}
	}
}


int main()
{
	lcd_init();
	srandom( time(NULL) ); //设置随机数种子，种子一样，产生的随机数是一样的

	exe_menu();
	
	while(1)
	{
		int r = get_intput_event();
		input_process(r);
	}
	
	lcd_uninit();
	return 0;
}

