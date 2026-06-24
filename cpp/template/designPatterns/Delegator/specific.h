#pragma once
#include "dalegator.h"


class AA
{
protected:
	int a=0;
	Delegetor* _delegetor;
public:
	AA(Delegetor* _delegetor);
	void setDelegator(Delegetor* delegetor);
	void update();
};


class BB:public Delegetor {
public:
	void callBack(void* ctx, const char* str) override;
};