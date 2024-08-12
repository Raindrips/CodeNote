#include "main.h"
#include "specific.h"
#include "dalegator.h"
using namespace std;

int main()
{
	BB *bb=new BB();
	AA *aa=new AA(bb);
	for (int i = 0; i < 100; i++)
	{
		aa->update();
	}
	
	return 0;
}
