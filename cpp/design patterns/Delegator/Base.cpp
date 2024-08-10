#include "dalegator.h"
#include "Base.h"

void Base::setDelegetor(Delegetor* _delegetor)
{
	this->_delegetor = _delegetor;
}

void Base::operator()(const char* str)
{
}
