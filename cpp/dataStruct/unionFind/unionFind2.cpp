#include <iostream>

using namespace std;

namespace U2
{
	class UnionFind
	{
		int *id;
		int count;

	public:
		UnionFind(int n) : count(n)
		{
			id = new int[n];
			for (int i = 0; i < n; i++)
			{
				id[i] = i;
			}
		}

		~UnionFind()
		{
			delete[] id;
		}

		int find(int p)
		{
			assert(p >= 0 && p < count);
			while (p != id[p])
				p = id[p];
			return p;
		}

		bool isConnected(int p, int q)
		{
			return find(p) == find(q);
		}

		void elemnets(int p, int q)
		{
			int pRoot = find(p);
			int qRoot = find(q);

			if (pRoot == qRoot)
				return;
			id[pRoot] = qRoot;
		}
	};
}
	int main()
	{
		
		return 0;
	}
