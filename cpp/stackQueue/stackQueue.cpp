#include <iostream>
#include <stack>
using namespace std;

//栈
class Stack {
public:
	void push(int val) {
		if (full()) {
			cout << "栈已经满了" << endl;
			return;
		}
		arr[_topIndex] = val;
		_topIndex++;
	}

	int pop() {
		if (empty()) {
			cout << "栈已经空了" << endl;
			return -1;
		}
		_topIndex--;
		return arr[_topIndex];
		//return arr[--_topIndex];  //可以简写成这样
	}

	int top() {
		if (empty()) {
			cout << "栈已经空了" << endl;
			return -1;
		}
		return arr[_topIndex];
	}

	bool empty() {
		return _topIndex <= 0;
	}

	bool full() {
		return _topIndex >= length;
	}

private:
	//数组
	int arr[10];
	int _topIndex = 0;
	const int length = 10;
};

//队列
class Queue {
public:
	//入队
	void push(int val) {
		if (full()) {
			cout << "队列已经满了" << endl;
			return;
		}
		index = (index + 1) % length;
		arr[index] = val;
		count++;
	}

	int front() {
		if (empty()) {
			cout << "队列已经空了";
			return -1;
		}
		return arr[last];
	}

	int pop() {
		if (empty()) {
			cout << "队列已经空了";
			return -1;
		}
		//index = (index - 1 < 0) ? (length - 1) : (index - 1);
		last = (last + 1) % length;
		count--;
		return arr[last];
	}

	bool empty() {
		return count <= 0;
	}

	bool full() {
		return count >= length;
	}

private:
	int arr[4];
	const int length = 4;	//数组的长度
	int count = 0;			//当前队列大小
	int index = -1;			//头部索引	
	int last = -1;			//尾部索引
};

void stack_test() {
	stack<int>* st = new stack<int>();      //创建一个栈的对象

	st->push(1);
	st->push(2);
	cout << st->top() << endl;          //获取栈顶元素
	st->pop();                          //取出栈中的元素
	st->push(3);
	st->push(4);

	while (!st->empty())
	{
		cout << st->top() << endl;          //获取栈顶元素
		st->pop();                          //取出栈中的元素
	}

	delete st;
}

void test2() {
	Stack* st = new Stack();
	st->push(1);
	st->push(2);
	st->push(3);
	st->push(4);

	cout << st->pop() << endl;
	cout << st->pop() << endl;
	cout << st->pop() << endl;
	cout << st->pop() << endl;
	delete st;
}

void queue_test() {
	Queue* que = new Queue();
	que->push(1);
	que->push(2);
	que->push(3);
	que->push(4);
	
	cout << que->pop() << endl;
	cout << que->pop() << endl;
	que->push(5);
	que->push(6);
	cout << que->pop() << endl;
	cout << que->pop() << endl;
	cout << que->pop() << endl;
	cout << que->pop() << endl;
}

int main()
{
	//stack_test();
	//test2();
	queue_test();
}