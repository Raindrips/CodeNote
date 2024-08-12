void Hanoi(int n, char A, char B, char C)
{
  if (n == 1) //如果只有一个直接从A移到B   "%2d-(%2d):%c==>%c\n"
  {
    printf("Move %d: from %c to %c\n", n, A, B);
  }
  else
  {
    Hanoi(n - 1, A, C, B); //把n - 1个从A移到C借助B

    printf("Move %d: from %c to %c\n", n, A, B);
    Hanoi(n - 1, C, B, A); //把n - 1个从C移到B借助B
  }
}

int main(){
   Hanoi(6,'A','B','C');
  return 0;
}