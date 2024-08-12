#include <iostream>
#include <algorithm>
#include <string>
#include <ctime>
#include <cmath>
#include <cassert>
#include <typeinfo>

using namespace std;

template<typename Item>
class IndexMaxHeap{
private:
    Item *data;
    int *indexes;
    int count;
    int capacity;

    void ShiftUp(int k){
        while (data[indexes[k/2]] < data[indexes[k]] && k > 1){
            swap(indexes[k/2], indexes[k]);
            k /= 2;
        }
    }

    void ShiftDown(){
        int k=1;
        while (k <= count/2){
            int j = 2*k; //此轮循环中，data[k]和data[j]交换位置
            if (data[indexes[j]] < data[indexes[j+1]] && j + 1 <= count)
                j += 1;
            if (data[indexes[k]] >= data[indexes[j]])
                break;

            swap(indexes[j], indexes[k]);
            k = j;
        }
    }

public:
    IndexMaxHeap(int capacity){
        data = new Item[capacity + 1];
        indexes = new int[capacity + 1];
        count = 0;
        this->capacity = capacity;
    }
    ~IndexMaxHeap(){
        delete[] data;
        delete[] indexes;
    }

    int size(){
        return count;
    }

    bool isEmpty(){
        return count == 0;
    }

    //传入的i对用户而言，是从0索引的
    void insert(int i, Item item){//插入元素

        assert( count + 1 <= capacity );
        assert( i + 1 >= 1 && i + 1 <= capacity);

        i += 1;
        data[i] = item;
        indexes[count+1] = i;

        count ++;
        ShiftUp(count);
    }

    Item extractMax(){//删除提取元素
        assert( count > 0);
        Item ret = data[indexes[1]];
        swap(indexes[1], indexes[count]);
        count --;
        ShiftDown(1);
        return ret;
    }

    int extractMaxIndex(){//提取最大元素索引
        assert( count > 0);

        int ret = indexes[1] - 1;

        swap(indexes[1], indexes[count]);
        count --;
        ShiftDown(1);

        return ret;
    }

    Item getItem(int i){//提取data数组中的值
        return data[i+1];
    }

    void change(int i, Item newItem){//改变堆中的元素

        i += 1;
        data[i] = newItem;

        //找到indexes[j] = i， j表示data[i]在堆中的位置
        //之后shiftUp(j)，再shiftDown(j)，两者可交换顺序
        for (int j = 1; j <= count; j++){ //算法复杂度 n+logn，也就是 O(n)
            if (indexes[j] == i){
                ShiftUp(j);
                ShiftDown(j);
                return;
            }
        }
    }
};


int main(){

}