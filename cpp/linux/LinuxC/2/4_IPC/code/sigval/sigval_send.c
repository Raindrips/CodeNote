
#include<stdio.h>
#include<signal.h>
#include<unistd.h>
#include<string.h>

int main(int argc,char *argv[])
{
    if(argc!=2)
    {
        printf("arguments error!");
        exit(0);
    }

    pid_t pid=atoi(argv[1]);//将进程号转化为整数
    union sigval v;
    v.sival_int=100;
    //这儿只是利用SIGINT来发送数据，
    //任何信号都行，只需要发送端与接收端规定一致即可
    sigqueue(pid,SIGINT,v);
    return 0;
}