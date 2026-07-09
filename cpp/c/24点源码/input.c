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

#include "input.h"
#include "calc.h"
#include "lcd.h"



extern struct data expression[32];//输入表达式数组
extern int exp_index;
extern int score;
extern int num24[4];
extern int flag_num[4];
extern char answer[256];
extern int UI_mod;//0为主菜单界面，1为练习模式界面，2为挑战模式界面
extern int flag_timeout;
extern flag_format_error;

int flag_dialog = 0;//对话标志



int get_intput_event()
{
	struct input_event ev;printf("%s %d\n",__FUNCTION__,__LINE__);
	int x=-1,y=-1;
	int fd = open("/dev/event0", O_RDONLY);
	if (fd == -1)
	{
		perror("open event failed:");
		return -1;
	}

	while (1)
	{
		int ret = read(fd, &ev, sizeof(ev));
		if(ret != sizeof(ev))
		{
			continue;
		}
		
		if (ev.type == EV_ABS && ev.code == ABS_X)//是x轴坐标
		{
			x = ev.value;
		}
		if (ev.type == EV_ABS && ev.code == ABS_Y)//是y轴坐标
		{
			y = ev.value;
		}

		if (ev.type == EV_ABS && ev.code == ABS_PRESSURE//手指弹起，再计算滑动方向
			&& ev.value == 0)//触摸屏压力值为0, press up
		{
			printf("x=%ld,y=%ld\n",x,y);
			if(UI_mod == 0)//为主菜单界面
			{
				if(x>=350 && x<=500 && y<=479-300 && y>=479-350)
				{
					close(fd);
					return PRACTICE_MOD;
				}
				else if(x>=350 && x<=500 && y<=479-400 && y>=479-450)
				{
					close(fd);
					return CHALLANGE_MOD;
				}
				else if(x == 111 && y == 111)
				{
					close(fd);
					return BACK;
				}
			}
			else if(UI_mod == 1 || UI_mod == 2)//为练习模式界面
			{
				if(x>=710-25 && x<=710+25 && y<=479-(320-9) && y>=479-(320+9))
				{
					printf("SUBMIT!\n");
					close(fd);
					return SUBMIT;
				}
				else if(x>=710-25 && x<=710+25 && y<=479-(420-9) && y>=479-(420+9))
				{
					printf("NEXT!\n");
					close(fd);
					flag_dialog = 1;
					return NEXT;
				}
				else if(x == 111 && y == 111)
				{
					close(fd);
					return BACK;
				}
				else if(x == 111 && y == 111 && flag_dialog == 1)
				{
					flag_dialog = 0;
					close(fd);
					return OK;
				}
				else if(x>=710-25 && x<=710+25 && y<=479-(370-9) && y>=479-(370+9))
				{
					printf("CLEAR!\n");
					close(fd);
					return CLEAR;
				}
				else if(x>=100-75 && x<=100+75 && y<=479-(120-84) && y>=479-(120+84))
				{
					printf("NUMA!\n");
					lcd_draw_diamonds(100,150,10,0xee00ee);//画方块
					close(fd);
					return NUMA;
				}
				else if(x>=300-75 && x<=300+75 && y<=479-(120-84) && y>=479-(120+84))
				{
					printf("NUMB!\n");
					lcd_draw_spade(300,150,10,0xee00ee);//画黑桃
					close(fd);
					return NUMB;
				}
				else if(x>=500-75 && x<=500+75 && y<=479-(120-84) && y>=479-(120+84))
				{
					printf("NUMC!\n");
					lcd_draw_hearts(500,150,10,0xee00ee);//画红桃
					close(fd);
					return NUMC;
				}
				else if(x>=700-75 && x<=700+75 && y<=479-(120-84) && y>=479-(120+84))
				{
					printf("NUMD!\n");
					lcd_draw_club(700,150,10,0xee00ee);//画梅花
					close(fd);
					return NUMD;
				}
				else if(x>=260-20 && x<=260+20 && y<=479-(300-20) && y>=479-(300+20))
				{
					printf("ADD!\n");
					close(fd);
					return ADD;
				}
				else if(x>=320-20 && x<=320+20 && y<=479-(300-20) && y>=479-(300+20))
				{
					printf("DEL!\n");
					close(fd);
					return DEL;
				}
				else if(x>=380-20 && x<=380+20 && y<=479-(300-20) && y>=479-(300+20))
				{
					printf("MUL!\n");
					close(fd);
					return MUL;
				}
				else if(x>=440-20 && x<=440+20 && y<=479-(300-20) && y>=479-(300+20))
				{
					printf("DIV!\n");
					close(fd);
					return DIV;
				}
				else if(x>=500-20 && x<=500+20 && y<=479-(300-20) && y>=479-(300+20))
				{
					printf("BRACKET_L!\n");
					close(fd);
					return BRACKET_L;
				}
				else if(x>=560-20 && x<=560+20 && y<=479-(300-20) && y>=479-(300+20))
				{
					printf("BRACKET_R!\n");
					close(fd);
					return BRACKET_R;
				}
			}
		}
	}
}

void input_process(int touch_value)
{printf("%s %d\n",__FUNCTION__,__LINE__);
	if(touch_value == PRACTICE_MOD && UI_mod == 0)
	{	
		exe_prat();		
	}
	else if(touch_value == CHALLANGE_MOD && UI_mod == 0)
	{
		exe_chal();
	}
	else if(touch_value == BACK)
	{
		if(UI_mod == 0)
		{
			exit(0);
		}
		else if(UI_mod == 1 || UI_mod == 2)
		{
			UI_mod = 0;
			exe_menu();
		}
	}
	else if(touch_value == NUMA && (UI_mod == 1 || UI_mod == 2) && flag_num[0] == 0)
	{
		expression[exp_index].mod = 2;
		expression[exp_index].num = num24[0];
		exp_index++;
		print_expr();
		flag_num[0] = 1;
	}
	else if(touch_value == NUMB && (UI_mod == 1 || UI_mod == 2) && flag_num[1] == 0)
	{
		expression[exp_index].mod = 2;
		expression[exp_index].num = num24[1];
		exp_index++;
		print_expr();
		flag_num[1] = 1;
	}
	else if(touch_value == NUMC && (UI_mod == 1 || UI_mod == 2) && flag_num[2] == 0)
	{
		expression[exp_index].mod = 2;
		expression[exp_index].num = num24[2];
		exp_index++;
		print_expr();
		flag_num[2] = 1;
	}
	else if(touch_value == NUMD && (UI_mod == 1 || UI_mod == 2) && flag_num[3] == 0)
	{
		expression[exp_index].mod = 2;
		expression[exp_index].num = num24[3];
		exp_index++;
		print_expr();
		flag_num[3] = 1;
	}
	else if(touch_value == ADD && (UI_mod == 1 || UI_mod == 2))
	{
		expression[exp_index].mod = 1;
		expression[exp_index].opr = '+';
		exp_index++;
		print_expr();
	}
	else if(touch_value == DEL && (UI_mod == 1 || UI_mod == 2))
	{
		expression[exp_index].mod = 1;
		expression[exp_index].opr = '-';
		exp_index++;
		print_expr();
	}
	else if(touch_value == MUL && (UI_mod == 1 || UI_mod == 2))
	{
		expression[exp_index].mod = 1;
		expression[exp_index].opr = '*';
		exp_index++;
		print_expr();
	}
	else if(touch_value == DIV && (UI_mod == 1 || UI_mod == 2))
	{
		expression[exp_index].mod = 1;
		expression[exp_index].opr = '/';
		exp_index++;
		print_expr();
	}
	else if(touch_value == BRACKET_L && (UI_mod == 1 || UI_mod == 2))
	{
		expression[exp_index].mod = 1;
		expression[exp_index].opr = '(';
		exp_index++;
		print_expr();
	}
	else if(touch_value == BRACKET_R && (UI_mod == 1 || UI_mod == 2))
	{
		expression[exp_index].mod = 1;
		expression[exp_index].opr = ')';
		exp_index++;
		print_expr();
	}
	else if(touch_value == NEXT )
	{
		if(UI_mod == 1)
		{
			flag_dialog = 1;
			print_answer();
			sleep(4);
			exe_prat();
		}
		else if(UI_mod == 2)
		{
			score -= 10;
			get_new_question();
		}
	}
	else if(touch_value == CLEAR && (UI_mod == 1 || UI_mod == 2) )
	{
		memset(expression,0,sizeof(expression));
		memset(flag_num,0,sizeof(flag_num));		
		exp_index = 0;
		flag_format_error = 0;
		draw_UI1();
	}
	else if(touch_value == OK)
	{
		if(UI_mod == 1 && flag_dialog == 1)
		{
			flag_dialog = 0;
			exe_prat();
		}
		else if(UI_mod == 2 && flag_timeout == 1)
		{
			flag_timeout = 0;
			exe_menu();
		}
	}
	else if(touch_value == SUBMIT)
	{printf("%s %d\n",__FUNCTION__,__LINE__);
		if(UI_mod == 1)
		{
			expression[exp_index].mod = 1;
			expression[exp_index].opr = '$';
			int r = judge_answer(expression);
			if( r == 0)
			{
				printf("answer is right!\n");
				print_right();
				sleep(2);
				exe_prat();	
			}
			else if(r == -2)
			{	
				printf("format error!\n");
				print_formaterror();
				sleep(2);
				memset(expression,0,sizeof(expression));
				memset(flag_num,0,sizeof(flag_num));
				exp_index = 0;
				draw_UI1();
			}
			else if(r == -1)
			{	
				printf("answer is wrong!\n");
				print_wrong();
				sleep(2);
				memset(expression,0,sizeof(expression));
				memset(flag_num,0,sizeof(flag_num));
				exp_index = 0;
				draw_UI1();
			}
		}
		if(UI_mod == 2)
		{
			expression[exp_index].mod = 1;
			expression[exp_index].opr = '$';
			int r = judge_answer(expression);
			if( r == 0)
			{
				print_right();
				score += 10;
				sleep(2);
				get_new_question();	
				draw_UI2();				
			}
			else if(r == -2)
			{
				print_formaterror();
				sleep(2);
				draw_UI2();
			}
			else if(r == -1)
			{
				print_wrong();
				score -= 10;
				sleep(2);
				get_new_question();
				draw_UI2();
			}
		}
	}
}
