#include <iostream>
#include <vector>
using namespace std;
//75.SortColor
class Solution
{
private:
	/* data */
	
public:
	void sortColor(vector<int> nums){
		int zero=-1;
		int two=nums.size();
		
		for (int i = 0; i < two; )
		{
			if (nums[i]==1)
			{
				i++;
			}else if(nums[i]==2){
				swap(nums[i],nums[--two]);
			}else{
				swap(nums[++zero],nums[i++]);
			}
		}
		
	}
};

int main(){

}