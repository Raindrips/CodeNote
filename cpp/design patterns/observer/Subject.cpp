#include "Subject.h"
#include "observer.h"

Subject::Subject()
	:state(0)
{
}


int Subject::getState()
{
	return state;
}

void Subject::setState(int state)
{
	this->state = state;
	notifyAllObservers();
}

void Subject::attach(Observer* observer)
{
	observers.push_back(observer);
}

void Subject::notifyAllObservers()
{
	for (auto observer : observers) {
		observer->update();
	}
}
