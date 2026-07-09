#include<stdio.h>
#include<stdlib.h>
#include<signal.h>
#include<unistd.h>

void func(int signo, siginfo_t *info, void *p)
{
	printf("signo=%d\n",signo);
	printf("sender pid=%d\n",info->si_pid);
	printf("si_errno =%d\n",info->si_errno);
	printf("si_code =%d\n",info->si_code);
	printf("si_uid=%d\n",info->si_uid);
	printf("si_status=%d\n",info->si_status);
	printf("si_value=%d\n",info->si_value);
	printf("si_fd=%d\n",info->si_fd);
}

int main(int argc,char *argv[])
{ 
  	struct sigaction act, oact;

  	sigemptyset(&act.sa_mask); /*initial. to empty mask*/
  	act.sa_flags = SA_SIGINFO;
	act.sa_sigaction=func;
  	sigaction(SIGUSR1, &act, &oact); 
    while (1) 
	{ 
		printf("pid is %d Hello world.\n",getpid()); 
		pause();
	}
}

