#pragma once

#include "behaviorTree.h"
namespace  BT
{
	class ActionNode : public BTNode
	{
	public:
		class Instance : public BTNodeInstance
		{
		protected:
			NodeStatus OnUpdate(BTContext& context, float deltaTime) override = 0;
		};
	};
}