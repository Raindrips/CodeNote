#include <iostream>
#include <vector>
#include <conio.h>
using namespace std;

class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        /**
           * 记录某行，某列,3x3 宫格内某位数字是否已经被摆放
           */
        vector<vector<bool>> row(N, vector<bool>(10));
        vector<vector<bool>> col(N, vector<bool>(10));
        vector<vector<bool>> block(N, vector<bool>(10));

        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                if (board[i][j] != '.') {
                    int num = board[i][j] - '0';
                    row[i][num] = true;
                    col[j][num] = true;
                    // blockIndex = i / 3 * 3 + j / 3，取整
                    block[i / 3 * 3 + j / 3][num] = true;
                }
            }
        }
        dfs(board, row, col, block, 0, 0);
    }
private:
    const int N = 9;
    bool dfs(vector<vector<char>>& board, vector<vector<bool>>& row, vector<vector<bool>>& col, vector<vector<bool>>& block, int i, int j) {
        // 找寻空位置
        while (board[i][j] != '.') {
            if (++j >= N) {
                i++;
                j = 0;
            }
            if (i >= N) {
                return true;
            }
        }
        for (int num = 1; num <= N; num++) {
            int blockIndex = i / 3 * 3 + j / 3;
            if (!row[i][num] && !col[j][num] && !block[blockIndex][num]) {
                // 递归
                board[i][j] = (char)('0' + num);
                row[i][num] = true;
                col[j][num] = true;
                block[blockIndex][num] = true;
                if (dfs(board, row, col, block, i, j)) {
                    return true;
                }
                else {
                    // 回溯
                    row[i][num] = false;
                    col[j][num] = false;
                    block[blockIndex][num] = false;
                    board[i][j] = '.';
                }
            }
        }
        return false;
    }
};
/**
    {'.','.','.','.','.','.','.','.','.'},  //1
    {'.','.','.','.','.','.','.','.','.'},  //2
    {'.','.','.','.','.','.','.','.','.'},  //3
    {'.','.','.','.','.','.','.','.','.'},  //4
    {'.','.','.','.','.','.','.','.','.'},  //5
    {'.','.','.','.','.','.','.','.','.'},  //6
    {'.','.','.','.','.','.','.','.','.'},  //7
    {'.','.','.','.','.','.','.','.','.'},  //8
    {'.','.','.','.','.','.','.','.','.'},  //9
**/


int main()
{
    vector<vector<char>> level_map = {
        {'.','.','.','.','.','.','.','.','.'},  //1
        {'.','.','.','.','.','.','.','.','.'},  //2
        {'.','.','.','.','.','.','.','.','.'},  //3
        {'.','.','.','.','.','.','.','.','.'},  //4
        {'.','.','.','.','.','.','.','.','.'},  //5
        {'.','.','.','.','.','.','.','.','.'},  //6
        {'.','.','.','.','.','.','.','.','.'},  //7
        {'.','.','.','.','.','.','.','.','.'},  //8
        {'.','.','.','.','.','.','.','.','.'},  //9
    };
    cout << "输入数据:(范围[1-9]，没有数据填 ‘.’)" << endl;
    for (auto&& e2 : level_map)
    {
        for (auto&& e : e2)
        {
            cin >> e;
        }
    }

    Solution s;
    s.solveSudoku(level_map);
    cout << "解数独" << endl;
    for (auto&& e2 : level_map)
    {
        for (auto&& e : e2)
        {
            cout << e << " ";
        }
        cout << endl;
    }
    
    return _getch();;
}
