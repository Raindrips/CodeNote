#pragma once

#include <vector>

class Observer;

class Subject
{
public:
	Subject();

	int getState();
    void setState(int state);
    void attach(Observer* observer);
    
    void notifyAllObservers();

    std::vector<Observer*> observers;
    int state;
private:
};

