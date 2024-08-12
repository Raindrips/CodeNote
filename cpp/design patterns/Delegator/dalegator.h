#pragma once
class Delegetor {
public:
	virtual ~Delegetor()=0;
	//template<typename T>
	virtual void callBack(void* obj,const char* str) = 0;
};