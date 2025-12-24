
#include "test.h"

int fn_output(const char* buf, int len, ikcpcb* kcp, void* user)
{
	union { int id; void* ptr; } parameter;
	parameter.ptr = user;
	//vnet->send(parameter.id, buf, len);
	return 0;
}

void myTest() {
	const IUINT32 task = 1; //回话 id,两个必须一样
	ikcpcb* kcp0 = ikcp_create(0x0, (void*)0);
	ikcpcb* kcp1 = ikcp_create(0x0, (void*)1);

	kcp0->output = fn_output;
	kcp1->output = fn_output;
}

int main()
{
	//test(0);	// 默认模式，类似 TCP：正常模式，无快速重传，常规流控
	//test(1);	// 普通模式，关闭流控等
	test(2);	// 快速模式，所有开关都打开，且关闭流控
	return 0;
}