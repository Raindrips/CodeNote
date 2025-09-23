#include <iostream>
#include <csignal>
using namespace std;

void signalHandler(int signum)
{
    cout << "Interrupt signal (" << signum << ") received.\n";

    // 清理并关闭
    // 终止程序  

    exit(signum);

}

// 注册信号 SIGINT 和信号处理程序
void test1() {
   
    signal(SIGINT, signalHandler);

    while (1) {
        cout << "Going to sleep...." << endl;
    }
}

//手动激活信号
void test2() {
    signal(SIGINT, signalHandler);
    for (int i = 0; i < 100; i++)
    {
        cout << "loop " << i << endl;
        if (i == 4) {
            raise(SIGINT);
        }
    }
}



int main()
{
    //test1();
    test2();

    return 0;
}