#include<iostream>
using namespace std;

/*
输入一个华氏温度，要求输出摄氏温度。公式为 c=5(F-32)/9，取位2小数。 

输入
一个华氏温度，浮点数
输出
摄氏温度，浮点两位小数

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