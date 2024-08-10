#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

void solution2(int n)
{
	//右 下 左 上 四个方向
	static int dir[][2] = {
		{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
	int d = 0;				  //默认往右
	int i = n - 1, j = n - 1; //右下的镜头
	int zi = 0, zj = 1;
	int x = 0, y = 0;
	vector<vector<int>> vec(n, vector<int>(n));
	int step = 1;
	while (step <= n * n)
	{
		//到右边尽头就往下
		if (d == 0 && x >= j)
		{
			j--;
			d = 1;
		}
		//到下边尽头就往左
		else if (d == 1 && y >= i)
		{
			i--;
			d = 2;
		}
		//到左边尽头就往上
		else if (d == 2 && x <= zi)
		{
			zi++;
			d = 3;
		}
		//上面尽头就往右
		else if (d == 3 && y <= zj)
		{
			zj++;
			d = 0;
		}
		vec[y][x] = step++;
		y += dir[d][0];
		x += dir[d][1];
	}

	for (const auto &e2 : vec)
	{
		for (const auto &e : e2)
		{
			cout << setw(2) << e << " ";
		}
		cout << endl;
	}
}

class Solution
{
public:
};
void rotate(vector<vector<int>> &matrix)
{
	int n = matrix.size();
	auto matrix_new = matrix;
	for (int i = 0; i < n; ++i)
	{
		for (int j = 0; j < n; ++j)
		{
			matrix_new[j][n - i - 1] = matrix[i][j];
		}
	}
	matrix = matrix_new;
}

int main()
{
	// int n;
	// cin >> n;
	// solution(n);

	vector<vector<int>> arr{3, vector<int>(3)};
	for (auto &v2 : arr)
	{
		for (auto &v : v2)
		{
			cin >> v;
		}
	}
	rotate(arr);
	for (auto &v2 : arr)
	{
		for (auto &v : v2)
		{
			cout << v << " ";
		}
		cout << endl;
	}
	return 0;
}
