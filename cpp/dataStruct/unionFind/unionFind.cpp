#include <iostream>
using namespace std;

class UnionFind{
	int *id;
	int count;
public:
	UnionFind(int n){
		count=n;
		id=new int[n];
		for(int i=0;i<n;i++){
			id[i]=i;
		}
	}
	
	~UnionFind(){
		delete[] id;
	}
	
	int find(int p){
		assert(p>=0&&p<count);
		return id[p];
	}

	//并查集合并
	void union(int p,int q){
		int pid=find(p);
		int qid=find(q);
		
		if(pid==qid)
			return;
		for(int i=0;i<count;i++){
			if(id[i]==pid)
				id[i]=qid;
		}
	}
	//查询两个元素是否在同一集合中
	bool isConnected(int p,int q){
		return find(p)==find(q);
	}
};

int main(){
	
	return 0;
}