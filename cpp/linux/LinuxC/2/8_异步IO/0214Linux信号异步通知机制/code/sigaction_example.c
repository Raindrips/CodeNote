#include<stdio.h>
#include<stdlib.h>
#include<signal.h>
void myHandler(int sig);
int main(int argc,char *argv[])
{ 
  	struct sigaction act, oact;

  	act.sa_handler = myHandler;
  	sigemptyset(&act.sa_mask); /*initial. to empty mask*/
  	act.sa_flags = 0;
  	sigaction(SIGINIT, &act, &oact); 
    while (1) 
	{ 
		printf("Hello world.\n"); 
		pause();
	}
	return 0;
}

  void myHandler(int sig)
  {
    printf("I got signal: %d.\n", sig);
  }
  // to end program, <Ctrl + \> to generate SIGQUIT



