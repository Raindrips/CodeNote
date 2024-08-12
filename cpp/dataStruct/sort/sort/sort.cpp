#include "sort.h"
#include <iostream>
#include <functional>
using namespace std;

void Sort::bubbleSort(std::vector<int>& vec)
{
	for (size_t i = 0; i < vec.size(); i++)
	{
		for (size_t j = i + 1; j < vec.size(); j++)
		{
			if (vec[j] < vec[i]) {
				swap(vec[j], vec[i]);
			}
		}
	}
}

void Sort::selectSort(std::vector<int>& vec)
{
	int min = 0;

	for (size_t i = 0; i < vec.size(); i++)
	{
		int min = i;
		for (size_t j = i + 1; j < vec.size(); j++)
		{
			if (vec[j] < vec[min]) {
				min = j;
			}
		}
		cout << vec[min] << endl;
		swap(vec[i], vec[min]);
	}
}

void Sort::insertSort(vector<int>& vec) {
	for (size_t i = 0; i < vec.size(); i++)
	{
		for (size_t j = i; j > 0; j--)
		{
			if (vec[j] < vec[j - 1])
			{
				swap(vec[j], vec[j - 1]);
			}
			else 
			{
				break;
			}
		}
	}
}

void Sort::resolve(vector<int>& vec, int l, int r)
{
	if (l < r)
	{
		int mid = (l + r) / 2;
		resolve(vec, l, mid);
		resolve(vec, mid + 1, r);
		merge(vec, l, mid, r);
	}
}

void Sort::mergeSort(vector<int>& vec)
{
	resolve(vec, 0, vec.size() - 1);
}

int Sort::partition(vector<int>& vec, int l, int r)
{
	int p = l;
	int val = vec[l];
	for (int i = l; i <= r; i++)
	{
		if (vec[i] < val)
		{
			p++;
			swap(vec[i], vec[p]);
		}

	}
	swap(vec[l], vec[p]);
	return p;
}

void Sort::quickSort(vector<int>& vec, int l, int r)
{
	if (l < r)
	{
		int p = partition(vec, l, r);
		quickSort(vec, l, p - 1);
		quickSort(vec, p + 1, r);
	}
}

void Sort::quickSort(vector<int>& vec)
{
	quickSort(vec, 0, vec.size() - 1);
}

void Sort::merge(vector<int>& vec, int l, int mid, int r)
{
	vector<int> aux(vec.begin() + l, vec.begin() + r + 1);
	int k = l, j = mid + 1;
	for (int i = l; i <= r; i++)
	{
		if (k > mid)
		{
			vec[i] = aux[j - l];
			j++;
		}
		else if (j > r) {
			vec[i] = aux[k - l];
			k++;
		}
		else if (aux[k - l] < aux[j - l]) {
			vec[i] = aux[k - l];
			k++;
		}
		else {
			vec[i] = aux[j - l];
			j++;
		}
	}
}

