#include <iostream>
#include <windows.h>

#include "Core.h"
#include "Dll.h"

#include "StateMachine.hpp"
#include "DoublyLinkedList.hpp"

typedef void (*InitFunc)(int, const char*);


// 加载DLL文件
void load_dll() {
	// 加载DLL文件
	HMODULE module_1 = LoadLibrary(__TEXT("Dll_1.dll"));
	if (!module_1) {
		Core_Log("module_1 is null");
		return;
	}
	InitFunc init = (InitFunc)GetProcAddress(module_1, "init");
	if (!init) {
		Core_Log("init is null");
		return;
	}
	init(10, "hello");

}

void test_1() {
	std::cout << "Hello, World!" << std::endl;

	Core_Log("这是导入的库");

	std::cout << GetName() << std::endl;
	DLL_log("动态库输出");
}

bool condition_idle(const std::shared_ptr<FSM::Blackboard>& context) {

	try {
		auto val = context->Get("x");
		double x = std::any_cast<double>(val);
		return std::abs(x > 0.01);
	}
	catch (const std::exception& e) {
		std::cerr << "Bad any_cast: " << e.what() << std::endl;
		return false;
	}
	return false;
}

bool condition_move(const std::shared_ptr<FSM::Blackboard>& context) {

	try {
		auto val = context->Get("x");
		double x = std::any_cast<double>(val);
		return std::abs(x < 0.01);
	}
	catch (const std::exception& e) {
		std::cerr << "Bad any_cast: " << e.what() << std::endl;
		return false;
	}
	return false;
}



void testMachine() {
	auto state = std::make_shared<FSM::CppState>("idle");
	auto moveState = std::make_shared<FSM::CppState>("move");

	auto t1 = std::make_shared<FSM::CppTransition>("idle-to-move", moveState->GetName(), condition_idle);
	auto t2 = std::make_shared<FSM::CppTransition>("move-to-idle", state->GetName(), condition_move);


	auto lamba = [](const std::shared_ptr<FSM::Blackboard>& context) {
		std::cout << "idle Enter" << std::endl;
		};
	state->SetEnterCallback(lamba);

	auto lamba2 = [](const std::shared_ptr<FSM::Blackboard>& context) {
		std::cout << "move Enter" << std::endl;
		};
	moveState->SetEnterCallback(lamba2);


	auto stateMachine = std::make_shared<FSM::StateMachine>();

	auto blackboard = stateMachine->GetBlackboard();
	blackboard->Set("x", 10.0);
	blackboard->Set("isJump", false);

	stateMachine->AddState(state);
	stateMachine->AddState(moveState);

	stateMachine->SetInitialState(state->GetName());

	stateMachine->AddTransition(state, t1);
	stateMachine->AddTransition(moveState, t2);

	int i = 0;
	while (true)
	{

		i = (i + 1) % 10;
		blackboard->Set("x", (double)i);
		stateMachine->Update(0.1f);
		std::cout << "x:" << i << " current:" << stateMachine->GetCurrentState()->GetName() << std::endl;

		Sleep(100);
	}

}

int main() {
	/*test_1();
	load_dll();*/
	testMachine();

	return 0;
}
