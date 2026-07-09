#include<stdio.h>
#include<unistd.h>
#include<signal.h>
#include<string.h>
//#include<sys/siginfo.h>

void handler(int,siginfo_t *,void *);

int main(void)
{
    struct sigaction act;
    act.sa_sigaction=handler;
    sigemptyset(&act.sa_mask);
    act.sa_flags=SA_SIGINFO;
    if(sigaction(SIGINT,&act,NULL)<0)
    {
        printf("error");
        exit(0);
    }
    for(;;)
        pause();
    return 0;
}

void handler(int sig,siginfo_t * info,void *ctx)
{
    printf("recv a sid=%d data=%d data=%d\n",sig,info->si_value.sival_int,info->si_int);
}
