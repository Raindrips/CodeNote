#pragma once
#include "Command.h"
class JumpCommand : public Command {

protected:
	void jump();
public:
	// 通过 Command 继承
	virtual void execute() override;
};

class FireCommand : public Command
{
private:
	void fireGun();
public:
	virtual void execute() override;
};

class MoveCommand :public Command {
public:
	// 通过 Command 继承
	virtual void execute() override;
};