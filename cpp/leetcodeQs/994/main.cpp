#include <iostream>
#include <queue>
#include <tuple>

using namespace std;
/*
  值 0 代表空单元格；
  值 1 代表新鲜橘子；
  值 2 代表腐烂的橘子。
*/

class Solution {
  using tb= tuple<int,int,int>;
public:
  int orangesRotting(vector<vector<int>>& grid) {
    int dis=0;    //腐烂次数
    int cnt=0;    //橘子数量
    queue<tb>que;
    
    for (size_t i = 0; i < grid.size(); i++)
    {
      for (size_t j = 0; j < grid[i].size(); j++)
      {
        if (grid[i][j] == 2)
				{
					que.push({ i,j,1 });
				}
        else if (grid[i][j] == 1){
          cnt++; 
        }
      }
    }
    while (!que.empty())
    {
      tb t=que.front();
      que.pop();
      static int dir[][2]={{1,0},{0,1},{-1,0},{0,-1}};
      for (int i = 0; i < 4; i++)
      {
        int y = get<0>(t)+dir[i][0];
        int x = get<1>(t)+dir[i][1];
        if (y>=0&&y<grid.size()&&x>=0&&x<grid[y].size()
            &&grid[y][x]==1)
        {
          dis=get<2>(t);
          cout<<"y:"<<y<<" x:"<<x<<endl;
          grid[y][x]=2;
          que.push({y,x,dis+1});
          cnt--;
        }
      }
    }
    return cnt==0?dis:-1;
  }
};
int main(){
  Solution s;
  vector<vector<int>> g={
    {2,1,1},
    {1,1,0},
    {0,1,1}};
  vector<vector<int>> g2={
    {1},
    {2},
    {1},
    {2}
  };
  int n=s.orangesRotting(g2);
  cout<<n<<endl;
}






