#include<unistd.h>
#include<signal.h>
#include<errno.h>
#include<stdio.h>
void handler(int sig)
{
	printf("int:hello\n");
}
int main()
{
	int i;
	signal(SIGALRM,handler);
	printf("%d\n",ualarm(5000000,2000000));
	//alarm(2);
	while(1)
	{
		sleep(1);
		printf("test\n");
	}
}
