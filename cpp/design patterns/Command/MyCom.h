#pragma once
#include "Command.h"
class JumpCommand : public Command {

protected:
	void jump();
public:
	// ͨ�� Command �̳�
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
	// ͨ�� Command �̳�
	virtual void execute() override;
};