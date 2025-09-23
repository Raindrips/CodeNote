//1、分别用顺序表和链表实现栈和队列。

#include<stdio.h>
#include<stdlib.h>
#include<assert.h>  //包含手动抛出错误函数头文件:参数为假(0或者NULL)时,就报错

typedef int Type;  //数据类型取别名
#define size 6  //数据域大小取别名

//顺序表实现栈:
struct Array  //栈结构体
{
	Type* data;  //栈的数据域
	int length;  //栈中数据的个数
	int capacity;  //栈中数据个数的最大值
};

Array* stack_init()  //栈的初始化
{
	Array* temp = (Array*)malloc(sizeof(Array));  //开辟内存空间
	assert(temp);  //空间开辟失败会报错
	temp->data = (Type*)calloc(size, sizeof(Type));  //栈数据域的初始化
	temp->length = 0;  //栈中实际数据个数的初始化
	temp->capacity = size;  //栈中数据个数最大值的初始化
	return temp;
}

bool stack_full(Array* arr)  //判断栈是否满了
{
	return (arr->length) > size;  //数据个数是否大于最大值
}

bool stack_empty(Array* arr)  //判断栈是否空了
{
	return arr->length == 0;  //数据个数是否等于0
}

void stack_push(Array* arr, Type val)  //入栈,尾插
{
	if (arr->length < arr->capacity)  //如果插入的数据个数比最大值小
	{
		arr->data[arr->length++] = val;  //向尾部插入数据,数据个数加加
	}
	else
		assert(!stack_full(arr));  //栈满了函数返回1,加个非变成0,提示错误
}

Type stack_pop(Array* arr)  //出栈
{
	Type data = arr->data[arr->length--];  //用变量保存数据域中的栈顶元素
	return data;  //返回数据
	assert(!stack_empty(arr));  //栈空了,提示错误
}

Type stack_top(Array* arr)  //获取栈顶元素
{
	assert(!stack_empty(arr));  //判断栈是否为空
	return arr->data[--arr->length];  //直接返回栈顶元素就行
}

//单链表实现队列:
struct Node  //队列节点的结构体
{
	Type data;  //数据域,保存数据
	Node* next;  //指针域,连接下一节点
};

struct List  //队列属性的结构图
{
	Node* head;  //头指针
	Node* end;  //尾指针
};

List* list_init()  //队列的初始化
{
	List* temp = (List*)malloc(sizeof(List));  //开辟内存空间
	assert(temp);  //开辟内存空间失败,会报错
	temp->head = temp->end = NULL;  //头尾指针都初始化为空
	return temp;
}

Node* queue_init(Type val)  //队列节点的初始化
{
	Node* temp = (Node*)malloc(sizeof(Node));  //开辟内存空间
	assert(temp);  //开辟内存空间失败,会报错
	temp->data = val;  //将传参给数据域赋值
	temp->next = NULL;  //没有节点,初始化为空
	return temp;
}

bool queue_empty(List* n)  //判断队列是否为空
{
	return n->head == NULL;  //头指针为空,链表为空
}

void queue_push(List* n, Type val)  //数据入队
{
	if (n->head == NULL)  //如果一个数据都没有
	{
		n->head = queue_init(val);  //创建第一个节点
		n->end = n->head;  //首尾相连
	}
	else  //尾插法
	{
		Node* temp = queue_init(val);  //创建第二个节点
		n->end->next = temp;			//调用连接函数连接两个节点
		n->end = temp;					//让第二个节点成为新的尾部
	}
}

Type queue_pop(List* n)  //数据出队
{
	assert(!queue_empty(n));  //判断队列是否为空
	Type val = n->head->data;  //将尾部的数据保存
	if (n->head->next == NULL)  //如果只有一个节点
	{
		free(n->head);  //释放头结点
		n->head = n->end = NULL;  //头尾都指向空	
	}
	else
	{
		Node* temp = n->head;  //临时指针指向头节点
		n->head = n->head->next;  //头结点指向后一个节点
		free(temp);  //释放老尾节点
	}
	return val;  //返回数据
}

Type queue_front(List* n)  //获取队首元素
{
	assert(!queue_empty(n));  //判断队列是否为空
	return n->head->data;  //返回头指针保存的数据
}

Type queue_back(List* n)  //获取队尾元素
{
	assert(!queue_empty(n));  //判断队列是否为空
	return n->end->data;  //返回尾指针保存的数据
}

int main()
{
	//Array * temp = stack_init();  //栈的初始化
	//Type a;
	//printf("请输入数据\n");
	//for (int i = 0; i < size; i++)
	//{
	//	scanf("%d", &a);
	//	stack_push(temp, a);  //入栈
	//}

	//printf("栈顶元素为:%d\n", stack_top(temp));  //获取栈顶元素

	//for (int i = size; i > 0; i--)
	//	printf("栈中的数据为:%d\n", stack_pop(temp));  //出栈

	List* temp = list_init();

	Type x;
	printf("请输入数据,按0结束\n");
	do
	{
		scanf("%d", &x);
		queue_push(temp, x);  //数据入队
	} while (x != 0);

	queue_pop(temp);  //数据出队



	system("pause");
	return 0;
}