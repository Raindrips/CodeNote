#include <iostream>
#include <vector>
using namespace std;

template <typename T>
int BinnarySearch(vector<T> arr,int target){
	int l=0,r=arr.size()-1;
	while(l<=r){
		int mid=(r-l)/2+l;
		if(arr[mid]==target){
			return mid;
		}
		if(arr[mid] > target){
			r=mid-1; 
		}
		else{
			l=mid+1;
		}
	}
	return -1;
}
int main(){
	vector<int> arr={1,2,3,4,5,6,7,8,9,10};
	cout<<arr[BinnarySearch(arr,6)];
	return 0;
}
