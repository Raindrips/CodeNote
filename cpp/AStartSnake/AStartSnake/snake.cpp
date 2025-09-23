#include <stdio.h>
#include <stdlib.h>
#include<time.h>
#include <easyx.h>//图形库头文件
#include "findpath.hpp"

struct position//坐标
{
  int x;//x轴
  int y;//y轴
};

struct snake//蛇的节点
{
  position pos;//方向
  snake* next;//指向下一个节点
};

enum direction//蛇的移动方向上下左右
{
  up = 0,
  down,
  right,
  left
};

direction dir;//蛇移动的方向
position food;//食物的节点

aStar as;
deque<Vec2> path;

struct snake* spawnnewbody()//蛇的节点
{
  snake* temp = (snake*)malloc(sizeof(snake));//申请内存
  if (temp == NULL)
  {
	printf("申请内存失败:%d\n", __LINE__);//找到bug的行数
	exit(-1);
  }
  temp->next = NULL;
  return temp;
}

snake* head = NULL;//蛇的头部//给指针初始化为空
snake* tail = NULL;//蛇的尾部

int wid = 600, hei = 600;//宽高
int px = 20;//像素大小，表示蛇和食物的大小
int mx, my;//方块坐标的最大值

void spawnnewfood()//生成食物
{
  food.x = rand() % mx;
  food.y = rand() % my;
  snake* t = tail;
  while (t->next)
  {
	if (food.x == t->pos.x && food.y == t->pos.y)
	{
	  spawnnewfood();
	  break;
	}
	t = t->next;
  }
}

bool iseatfood()//检测是否吃到食物
{
  if (head->pos.x == food.x && food.y == head->pos.y)
  {
	return true;
  }
  return false;
}

void init()//初始化游戏的函数
{
  initgraph(wid, hei);
  mx = wid / px;
  my = hei / px;
  position pos = { 5, 3 };
  tail = spawnnewbody();//创建蛇新的身体在链表尾部
  snake* h = tail;//临时变量保存head
  for (int i = 0; i < 2; i++)//遍历身体节点
  {
	h->pos = pos;//让head的坐标为我们给的{5，3}
	pos.x++;
	h->next = spawnnewbody();//给身体新建第二个节点
	h = h->next;
  }
  h->pos = pos;//单链表
  head = h;
  dir = down;
  srand(time(NULL));//初始化随机种子
  spawnnewfood();
}

void move()//蛇的移动
{
  snake* t = tail;//尾节点临时变量
  snake* h = head;//头节点使用临时变量
  while (t->next != NULL)//让尾部跟着头部动
  {
	t->pos = t->next->pos;//尾巴的坐标=头部的坐标
	t = t->next;
  }
  switch (dir)//判断方向，坐标变化
  {
  case up:
	h->pos.y--;
	break;
  case down:
	h->pos.y++;
	break;
  case right:
	h->pos.x++;
	break;
  case left:
	h->pos.x--;
	break;
  }
}

void autoMove() {
  snake* t = tail;//尾节点临时变量
  snake* h = head;//头节点使用临时变量
  while (t->next != NULL)//让尾部跟着头部动
  {
	t->pos = t->next->pos;//尾巴的坐标=头部的坐标
	t = t->next;
  }
  if (!path.empty())
  {
	head->pos.x = path.front().x;
	head->pos.y = path.front().y;
	path.clear();

  }
}

void drawpix(int x, int y, COLORREF color)//绘制一个方块,xy坐标和绘制的颜色
{
  setfillcolor(color);//设置填充颜色
  //用指定的图象填充坐标在(x, y)处，宽width，高height的矩形
  fillrectangle(x * px, y * px, x * px + 20, y * px + 20);
}

void draw()//图形的绘制
{  //遍历节点绘制方块
  BeginBatchDraw();
  cleardevice();//清除图形屏幕
  snake* t = tail;//尾节点临时变量
  while (t)
  {
	drawpix(t->pos.x, t->pos.y, 0x366ff);
	t = t->next;
  }
  drawpix(head->pos.x, head->pos.y, 0x99eeff);
  drawpix(food.x, food.y, 0xff12);
  EndBatchDraw();
}


void changedir()//改变蛇运行方向的函数
{
  //检测键盘按下的键
  if (GetAsyncKeyState(VK_UP))
  {
	if (dir != down)
	  dir = up;
  }
  if (GetAsyncKeyState(VK_DOWN))
  {
	if (dir != up)
	  dir = down;
  }
  if (GetAsyncKeyState(VK_LEFT))
  {
	if (dir != left)
	  dir = right;
  }
  if (GetAsyncKeyState(VK_RIGHT))
  {
	if (dir != right)
	  dir = left;
  }
}

bool isgameover()//判断游戏是否结束
{
  //判断是否会吃到自己
  snake* t = tail;
  if (t != head && t->next)
  {
	if (t->pos.x == head->pos.x && t->pos.y == head->pos.y)
	{
	  return true;
	}
  }
  //是否撞到墙
  if (head->pos.x<0 || head->pos.x>mx || head->pos.y<0 || head->pos.y>my)
  {
	return true;
  }
  return false;
}

bool gameover(int x, int y)//判断游戏是否结束
{
  //判断是否会吃到自己
  snake* t = tail;
  while (t != head && t->next)
  {
	if (t->pos.x == x && t->pos.y == y)
	{
	  return false;
	}
	t = t->next;
  }
  //是否撞到墙
  if (x < 0 || x >= mx || y < 0 || y >= my)
  {
	return false;
  }
  return true;
}


void rungame()//运行游戏的函数
{

  init();
  as.outFilter = gameover;

  while (true)
  {
	//move();
	as.findPath(head->pos.x, head->pos.y, food.x, food.y, path);
	while (path.empty()) {
	  int x = rand() % mx, y = rand() % my;
	  if (head->pos.x == x && head->pos.y == y) continue;
	  as.findPath(head->pos.x, head->pos.y, x, y, path);
	}
	autoMove();
	if (iseatfood())
	{
	  head->next = spawnnewbody();
	  head = head->next;
	  head->pos = food;
	  spawnnewfood();
	  as.findPath(head->pos.x, head->pos.y, food.x, food.y, path);
	}
	if (isgameover())
	{
	  //显示对话框
	  draw();
	  MessageBox(GetForegroundWindow(), TEXT("走进死胡同,找不到路了"), NULL, 0);
	  getchar();
	  break;
	}
	draw();
	Sleep(30);
  }
}
int main()
{
  rungame();
  return 0;
}