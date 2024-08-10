#include <vector>
#include <cassert>

//实现一个稠密图
class DeseGraph{

    public:
    int n,m;
    bool directed;
    std::vector<std::vector<bool>> g;
    DeseGraph(int n,bool directed=false):n(n),directed(directed){
         this->m=0;
         for (size_t i = 0; i < n; i++)
         {
             g.push_back(std::vector<bool>(n,false));
         }         
    }
    int V(){return n;}; //顶点
    int E(){return m;}; //边

    //连接顶点
    void addEdge(int v,int w){
        assert(v>=0&&v<n);
        assert(w>=0&&w<n);

        g[v][w] = true;
        if (!directed)
            g[w][v]=true;
        m++;
    }
    //是否连接
    bool hasEdge(int v,int w){
        assert(v>=0&&v<n);
        assert(w>=0&&w<n);  
        return g[v][w];
    }

    class Iterator{
        DeseGraph &G;
        int v;
        int index;
    public:
        Iterator(DeseGraph &G,int v):G(G){
            this->v=v;
            this->index=0;
        }

        int begin(){
            index=0;
            if (G.g[v].size())
            {
                return G.g[v][index];
            }
            return -1;
        }

        int end(){
            return -1;
        }

        int next(){
            index++;
            if (index<G.g[v].size())
            {
                return G.g[v][index];
            }
            return -1;
        }
    };
};

