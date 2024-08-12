#include <vector>
#include <cassert>

//实现一个稠密图
class SparseGraph{

    public:
    int n,m;
    bool directed;
    std::vector<std::vector<int>> g;
    SparseGraph(int n,bool directed=false):n(n),directed(directed){
        this->m=0;
        for (size_t i = 0; i < n; i++)
        {
            g.push_back(std::vector<int>());
        }
    }
    int V(){return n;}; //顶点
    int E(){return m;}; //边

    void addEdge(int v,int w){
        assert(v>=0&&v<n);
        assert(w>=0&&w<n);

        g[v].push_back(w);
        //是否是无向图
        if (!directed)
        {
             g[w].push_back(v);
        }
        m++;
    }

    bool hasEdge(int v,int w){
        assert(v>=0&&v<n);
        assert(w>=0&&w<n); 
        for (auto e:g[v])
            if (e==w)
                return true;
        return false;
    }

    class Iterator{
        
        SparseGraph& g;
        int v;
        int index;
        public:
        Iterator(SparseGraph &g,int v):g(g){
            this->v=v;
            this->index=0;
        }

        int begin(){
            this->index=0;
            if(g.g[v].empty()){
                return -1;
            }
            return g.g[v][index];
        }
        int next(){
            index++;
            if(index<g.g[v].size()){
                return -1;
            }
            return g.g[v][index];
        }
        bool end(){
            return index>=g.g[v].size(); 
        }
    };
};
#include <ctime>
int main(){
    int N=20;
    int M=100;
    srand(time(nullptr));

    SparseGraph sg(N);
    for (size_t i = 0; i < M; i++)
    {
        
    }
    
}