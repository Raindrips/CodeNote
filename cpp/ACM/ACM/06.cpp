#include<iostream>
using namespace std;

/*
����һ�������¶ȣ�Ҫ����������¶ȡ���ʽΪ c=5(F-32)/9��ȡλ2С���� 

����
һ�������¶ȣ�������
���
�����¶ȣ�������λС��

*/

float FahrenheitToDegree(double Fahrenheit) {
  return 5*(Fahrenheit-32)/9;
}   
int main()
{
  float Fahrenheit;
  cin >> Fahrenheit;
  printf("%.2f", FahrenheitToDegree(Fahrenheit));
  
  return 0;
}