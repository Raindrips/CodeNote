#include "MyCom.h"
#include <iostream>

using namespace std;
void JumpCommand::jump() {
	cout << "jump()" << endl;
}

void JumpCommand::execute()
{
	jump();
}

void FireCommand::fireGun() {
	cout << "fireGun()" << endl;
}

void FireCommand::execute()
{
	fireGun();
}

void MoveCommand::execute()
{

}
