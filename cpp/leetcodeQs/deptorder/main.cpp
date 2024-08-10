#include <tuple>
#include <vector>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

class Solution {
    using depth=tuple<TreeNode*,int>;
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> vec2;
        queue<depth> que;

        
    }
};