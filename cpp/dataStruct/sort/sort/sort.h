#pragma once


#include <vector>
using std::vector;
class Sort
{
private:
	void merge(vector<int>& vec, int l, int mid, int r);

	void resolve(vector<int>& vec, int l, int r);

	int partition(vector<int>& vec, int l, int r);

	void quickSort(vector<int>& vec, int l, int r);
public:
	//冒泡排序
	void bubbleSort(std::vector<int>& vec);
	//选择排序
	void selectSort(std::vector<int>& vec);
	//插入排序
	void insertSort(std::vector<int>& vec);

	//归并排序
	void mergeSort(vector<int>& vec);

	//快速排序
	void quickSort(vector<int>& vec);
};