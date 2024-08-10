#include <iostream>
class Singleton {
	Singleton() { std::cout << "Singleton()" << std::endl; }
	static Singleton* instance;
public:
	static Singleton* getInstance();
};
