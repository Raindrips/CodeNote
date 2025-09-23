#include <stdio.h>
#include <stdlib.h>
#include<time.h>
#include <easyx.h>//ͼ�ο�ͷ�ļ�
#include "findpath.hpp"

struct position//����
{
  int x;//x��
  int y;//y��
};

struct snake//�ߵĽڵ�
{
  position pos;//����
  snake* next;//ָ����һ���ڵ�
};

enum direction//�ߵ��ƶ�������������
{
  up = 0,
  down,
  right,
  left
};

direction dir;//���ƶ��ķ���
position food;//ʳ��Ľڵ�

aStar as;
deque<Vec2> path;

struct snake* spawnnewbody()//�ߵĽڵ�
{
  snake* temp = (snake*)malloc(sizeof(snake));//�����ڴ�
  if (temp == NULL)
  {
	printf("�����ڴ�ʧ��:%d\n", __LINE__);//�ҵ�bug������
	exit(-1);
  }
  temp->next = NULL;
  return temp;
}

snake* head = NULL;//�ߵ�ͷ��//��ָ���ʼ��Ϊ��
snake* tail = NULL;//�ߵ�β��

int wid = 600, hei = 600;//���
int px = 20;//���ش�С����ʾ�ߺ�ʳ��Ĵ�С
int mx, my;//������������ֵ

void spawnnewfood()//����ʳ��
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

bool iseatfood()//����Ƿ�Ե�ʳ��
{
  if (head->pos.x == food.x && food.y == head->pos.y)
  {
	return true;
  }
  return false;
}

void init()//��ʼ����Ϸ�ĺ���
{
  initgraph(wid, hei);
  mx = wid / px;
  my = hei / px;
  position pos = { 5, 3 };
  tail = spawnnewbody();//�������µ�����������β��
  snake* h = tail;//��ʱ��������head
  for (int i = 0; i < 2; i++)//��������ڵ�
  {
	h->pos = pos;//��head������Ϊ���Ǹ���{5��3}
	pos.x++;
	h->next = spawnnewbody();//�������½��ڶ����ڵ�
	h = h->next;
  }
  h->pos = pos;//������
  head = h;
  dir = down;
  srand(time(NULL));//��ʼ���������
  spawnnewfood();
}

void move()//�ߵ��ƶ�
{
  snake* t = tail;//β�ڵ���ʱ����
  snake* h = head;//ͷ�ڵ�ʹ����ʱ����
  while (t->next != NULL)//��β������ͷ����
  {
	t->pos = t->next->pos;//β�͵�����=ͷ��������
	t = t->next;
  }
  switch (dir)//�жϷ�������仯
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
  snake* t = tail;//β�ڵ���ʱ����
  snake* h = head;//ͷ�ڵ�ʹ����ʱ����
  while (t->next != NULL)//��β������ͷ����
  {
	t->pos = t->next->pos;//β�͵�����=ͷ��������
	t = t->next;
  }
  if (!path.empty())
  {
	head->pos.x = path.front().x;
	head->pos.y = path.front().y;
	path.clear();

  }
}

void drawpix(int x, int y, COLORREF color)//����һ������,xy����ͻ��Ƶ���ɫ
{
  setfillcolor(color);//���������ɫ
  //��ָ����ͼ�����������(x, y)������width����height�ľ���
  fillrectangle(x * px, y * px, x * px + 20, y * px + 20);
}

void draw()//ͼ�εĻ���
{  //�����ڵ���Ʒ���
  BeginBatchDraw();
  cleardevice();//���ͼ����Ļ
  snake* t = tail;//β�ڵ���ʱ����
  while (t)
  {
	drawpix(t->pos.x, t->pos.y, 0x366ff);
	t = t->next;
  }
  drawpix(head->pos.x, head->pos.y, 0x99eeff);
  drawpix(food.x, food.y, 0xff12);
  EndBatchDraw();
}


void changedir()//�ı������з���ĺ���
{
  //�����̰��µļ�
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

bool isgameover()//�ж���Ϸ�Ƿ����
{
  //�ж��Ƿ��Ե��Լ�
  snake* t = tail;
  if (t != head && t->next)
  {
	if (t->pos.x == head->pos.x && t->pos.y == head->pos.y)
	{
	  return true;
	}
  }
  //�Ƿ�ײ��ǽ
  if (head->pos.x<0 || head->pos.x>mx || head->pos.y<0 || head->pos.y>my)
  {
	return true;
  }
  return false;
}

bool gameover(int x, int y)//�ж���Ϸ�Ƿ����
{
  //�ж��Ƿ��Ե��Լ�
  snake* t = tail;
  while (t != head && t->next)
  {
	if (t->pos.x == x && t->pos.y == y)
	{
	  return false;
	}
	t = t->next;
  }
  //�Ƿ�ײ��ǽ
  if (x < 0 || x >= mx || y < 0 || y >= my)
  {
	return false;
  }
  return true;
}


void rungame()//������Ϸ�ĺ���
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
	  //��ʾ�Ի���
	  draw();
	  MessageBox(GetForegroundWindow(), TEXT("�߽�����ͬ,�Ҳ���·��"), NULL, 0);
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