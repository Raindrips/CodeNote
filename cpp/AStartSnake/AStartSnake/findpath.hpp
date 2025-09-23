#pragma once
#include <vector>
#include <cmath>
#include <iostream>
#include <string>
#include <deque>
#include <functional>
using std::cout;
using std::endl;
using std::vector;
using std::deque;
using std::function;

//节点
struct node {
  node* parent;
  int x;
  int y;
  int G;  //从起点到该点消耗的代价
  int H;  //从该点到终点的预估代价
  int getF() { return this->G + this->H; }; //指的是走到终点消耗的代价值
  node(int x, int y, int  G, int H, node* p = nullptr) {
	this->x = x; this->y = y; this->G = G; this->H = H; this->parent = p;
  }
};

//坐标
struct Vec2 {
  int x;
  int y;
  Vec2() { x = 0; y = 0; }
  Vec2(int x, int y) :x(x), y(y) {}
};
//A* 寻路算法
class aStar {
private:
  vector<node*> openList;
  vector<node*> closeList;
  int end_x = 0;
  int end_y = 0;
public:
  function<bool(int, int)> outFilter;  //外部判断的接口
  /**
   * 寻找获取 start点 到 end点 的最短路径 ，计算返回是否成功 ， outPath ： 路径坐标数组[x,y,x1,y1...]
   * Find the shortest path between "start" "end" two points
   *
   * @argument start_x coordinate x of Start Point
   * @argument start_y coordinate y of Start Point
   * @argument end_x coordinate y of End Point
   * @argument end_y coordinate y of End Point
   * @argument outPath Calculation result of Path , format is [x,y,x1,y1,x2,y2.........]
   */
  bool findPath(int start_x, int start_y, int end_x, int end_y, deque<Vec2>& outPath) {
	bool result = false;
	this->end_x = end_x; this->end_y = end_y;

	//将起点加入close表
	auto H = this->calcH(start_x, start_y);
	this->closeList.push_back(new node(start_x, start_y, 0, H));
	node* endNode = nullptr;
	auto count = 0L;
	auto lastLen = 0L;

	//jump out "while" when the closelist not have any new add
	while (lastLen < this->closeList.size()) {
	  lastLen = this->closeList.size();
	  //获取close表的最后一个节点S
	  auto snode = this->closeList.back();
	  //获取S点周围所有符合加入条件的点，加入open列表
	  this->findAddNeighbor(snode);
	  //计算open列表F值最低的格子T
	  node* minFnode = nullptr;
	  auto minIdx = 0;
	  for (long i = this->openList.size() - 1; i >= 0; i--) {
		auto n = this->openList[i];
		if (!n) continue;
		if (n->x == end_x && n->y == end_y) {
		  endNode = n;
		  break;
		}
		if (!minFnode || n->getF() < minFnode->getF()) {
		  minFnode = n;
		  minIdx = i;
		}
		if (i == 0) {
		  this->openList.erase(openList.begin() + minIdx);
		}
	  }

	  if (endNode) break;  //找到了 目标点
	  if (!minFnode) continue;
	  //T从open表中删除加入close表
	  this->closeList.push_back(minFnode);
	  printf("times_%ld x:%d y:%d\n", count++, minFnode->x, minFnode->y);
	}
	if (endNode) {
	  while (endNode) {
		outPath.push_back(Vec2(endNode->x, endNode->y)); //y
		//outPath.push_back(endNode->x); //x
		endNode = endNode->parent;
	  }
	  deque<Vec2> de(outPath.begin(), outPath.end());
	  outPath.assign(de.rbegin(), de.rend());
	  outPath.pop_front();
	  result = true;
	}
	//清理
	for (auto n : openList)
	{
	  delete n;
	}
	for (auto n : closeList)
	{
	  delete n;
	}
	openList.resize(0);
	closeList.resize(0);
	return result;
  }

  /*计算H
   *now_x 当前x位置
   *now_y 当前y的位置
  */
  int calcH(int now_x, int now_y) {
	return std::abs(end_x - now_x) + std::abs(end_y - now_y);
  }

  //找到附近的数据,并加入openlist
  void findAddNeighbor(node* n) {
	vector<Vec2> dir(4);
	dir[0].x = n->x - 1; dir[0].y = n->y;	    //left
	dir[1].x = n->x;     dir[1].y = n->y - 1;   //top
	dir[2].x = n->x + 1; dir[2].y = n->y;	    //right
	dir[3].x = n->x;     dir[3].y = n->y + 1;   //botoom

	for (auto i = 0; i < dir.size(); i++)
	{
	  auto point = dir[i];
	  if (this->filterNeighbor(point.x, point.y))
	  {
		auto H = this->calcH(point.x, point.y);
		this->openList.push_back(new node(point.x, point.y, n->G + 1, H, n));
	  }
	}
  }

  /*过滤附近无效的
   *x y 坐标
   */
  bool filterNeighbor(int x, int y) {
	if (this->listHas(this->openList, x, y) || this->listHas(this->closeList, x, y))
	  return false;
	if (bool(outFilter) && !outFilter(x, y)) //通过外部接口,判断是否时候可以走到的路
	  return false;
	return true;
  }

  /*判断列表是包含该坐标
   *ns open列表或close列表
   *x X坐标
   *y Y坐标
   */
  bool listHas(vector<node*>& ns, int x, int  y)
  {
	for (auto i = 0; i < ns.size(); i++)
	{
	  auto n = ns[i];
	  if (n->x == x && n->y == y)
		return true;
	}
	return false;
  }
};
