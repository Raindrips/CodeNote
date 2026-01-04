
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


	// 平均延迟200ms，每20ms发送一个包，
	// 
	//配置窗口大小： 而考虑到丢包重发，设置最大收发窗口   收:128,发:128
	ikcp_wndsize(kcp0, 128, 128);
	ikcp_wndsize(kcp1, 128, 128);


	// 设置模式  0, 10, 0, 0 是默认模式
	// 第二个参数 nodelay-启用以后若干常规加速将启动
	// 第三个参数 interval为内部处理时钟，默认设置为 10ms
	// 第四个参数 resend为快速重传指标
	// 第五个参数 为是否禁用常规流控
	ikcp_nodelay(kcp0, 0, 10, 0, 0);
	ikcp_nodelay(kcp1, 0, 10, 0, 0);

	char buffer[2000];
	int hr;

	// 释放 kcp对象
	ikcp_release(kcp0);
	ikcp_release(kcp1);

}

int main()
{
	//test(0);	// 默认模式，类似 TCP：正常模式，无快速重传，常规流控
	//test(1);	// 普通模式，关闭流控等
	test(2);	// 快速模式，所有开关都打开，且关闭流控
	return 0;
}