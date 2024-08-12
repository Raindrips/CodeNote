#include <iostream>
#include <vector>
#include <bits/stdc++.h>
using namespace std;
class Solution {
    struct pos{
        int x,y;
    };
public:
    int length=8;

    pos findR(vector<vector<char>>& board){
        for(int i=0;i<length;i++){
            for(int j=0;j<length;j++){
                if(board[i][j]=='R')
                {
                    return {j,i};
                }
            }
        }
        return {-1,-1};
    }
    bool inArea(int x,int y){
       return !(x>=length||x<0||y>=length||y<0);
    }
    
    int numRookCaptures(vector<vector<char>>& board) {
        int count=0;
        pos p=findR(board);
        pos dir[4]={{0,1},{1,0},{-1,0},{0,-1}};
        
        for(int i=0;i<4;i++){
            pos tmp=p;
            while (true)
            {
                tmp.x+=dir[i].x;
                tmp.y+=dir[i].y;
                if (!inArea(tmp.x,tmp.y)||board[tmp.y][tmp.x]=='B'){
                    break;
                }
                if (board[tmp.y][tmp.x]=='p'){
                    count++;
                    break;
                }
            }
        }
        return count;
    }
};
int main()
{
	vector<vector<char>> board={{'.','.','.','.','.','.','.','.'},{'.','p','p','p','p','p','.','.'},{'.','p','p','B','p','p','.','.'},{'.','p','B','R','B','p','.','.'},{'.','p','p','B','p','p','.','.'},{'.','p','p','p','p','p','.','.'},{'.','.','.','.','.','.','.','.'},{'.','.','.','.','.','.','.','.'}};
	Solution s;
	int c=s.numRookCaptures(board);
    cout<<c<<endl;
	return 0;
}
