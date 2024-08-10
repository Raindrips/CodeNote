#include <iostream>
#include <vector>
using namespace std;

class Solution
{
private:
	vector<vector<char>> isvisit;
	void foodfill(int x, int y)
	{
		static const int dir[][2] = {
			{1, 0},
			{0, 1},
			{-1, 0},
			{0, -1}};
		if (x < 0 || y < 0 || y >= isvisit.size() || x >= isvisit[y].size() || isvisit[y][x] != '1')
		{
			return;
		}
		isvisit[y][x] = '0';
		for (int i = 0; i < 4; i++)
		{
			int zy = y + dir[i][0];
			int zx = x + dir[i][1];
			foodfill(zx, zy);
		}
	}

public:
	int numIslands(vector<vector<char>> &grid)
	{

		isvisit.assign(grid.begin(), grid.end());
		int count = 0;
		for (int i = 0; i < isvisit.size(); i++)
		{
			for (int j = 0; j < isvisit[i].size(); j++)
			{
				if (isvisit[i][j] == '1')
				{
					count++;
					foodfill(j, i);
				}
			}
		}
		return count;
	}
};

int main()
{
	vector<vector<char>> grid = {

		{'1', '1', '1', '1', '0'},
		{'1', '1', '0', '1', '0'},
		{'1', '1', '0', '0', '0'},
		{'0', '0', '0', '0', '1'},
	};
	Solution s;
	int v = s.numIslands(grid);
	cout << v << endl;
}
