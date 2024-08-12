#include "MyCom.h"
#include "GameActor.h"
#include <iostream>
using namespace std;
int main()
{
	GameActor ga;
	ga.doCommand(new JumpCommand());
	ga.doCommand(new JumpCommand());
				  
	ga.doCommand(new FireCommand());
	ga.doCommand(new FireCommand());
				  
	ga.doCommand(new JumpCommand());
	ga.doCommand(new FireCommand());
	cout << "---------------------------" << endl;
	ga.replay();
	return 0;
}
