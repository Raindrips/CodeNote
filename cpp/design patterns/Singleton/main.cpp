#include "main.h"

using namespace std;

template <typename T,int N>
void temp(T (&t)[N]) {
	for (int i = 0; i < N; i++)
	{
		cout << t[i] << " ";
	}
	cout << endl;
}

int main()
{
	int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
	temp(arr);
	return 0;
}
