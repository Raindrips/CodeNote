#ifndef __CALC_H__
#define __CALC_H__

struct data
{
	int mod;//0为空单位，1为字符单位，2为数字单位
	float num;
	char opr;	
};
extern int find_answer(int *n);
extern int calc_24(struct data* str);

#endif