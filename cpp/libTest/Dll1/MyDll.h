#pragma once
#include "pch.h"
#include "behavior.h"
class MATHLIBRARY_API MyDll :
	public IBehavior
{
public:
	// Í¨¹ý Behavior ¼Ì³Ð
	virtual void start() override;
	virtual int end(int val) override;
	virtual void fn() override;
};

