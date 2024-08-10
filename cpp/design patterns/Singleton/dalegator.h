#pragma once
class Delegetor {
public:
	virtual ~Delegetor();
	virtual void callBack(void* ctx,const char* str) = 0;
};