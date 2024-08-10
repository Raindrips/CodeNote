#pragma once
class Subject;

class Observer {

protected:
	Subject* subject=nullptr;
public:
	virtual void update()=0;
};