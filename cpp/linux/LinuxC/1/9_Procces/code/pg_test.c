#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
int main()
{
   int fd;
   //复刻线程
   pid_t pid = fork();
   //返回-1 进程复刻失败
   if (pid == -1)
      perror("fork");
   else if (pid > 0)
   {
      wait(NULL);
      exit(EXIT_FAILURE);     
   }
   else
   {
      if ((fd = open("/dev/pts/0", O_RDWR)) == -1)
      {
         perror("open");
      }
      //进程号
      printf("pid=%d,ppid=%d\n", getpid(), getppid());
      //用户号
      printf("sid=%d,tcgetsid=%d\n", getsid(getpid()), tcgetsid(fd));
      
      printf("tcgetpgrp=%d\n", tcgetpgrp(fd));
      printf("pigd=%d\n", getpgid(getpid()));
   }
}
