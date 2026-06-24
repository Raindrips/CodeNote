#include "dalegator.h"

class Base {
	Delegetor* _delegetor;
	Base(Delegetor* _delegetor);
	void setDelegetor(Delegetor* _delegetor);

	void operator()(const char* str);
	//void updata();
};