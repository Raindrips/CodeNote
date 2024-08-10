#pragma once
#include "pch.h"
class MATHLIBRARY_API IBehavior {
public:

	static const int id = 0;
	~IBehavior() = default;
	virtual void start() = 0;
	virtual int end(int val) = 0;
	virtual void fn() = 0 {
		start();
		end(id);
	}
};