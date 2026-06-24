#pragma once
#include "behaviorTree.h"
namespace BT
{

	class DecoratorNodeInstance : public BTNodeInstance
	{
	public:
		void InitChild(const std::shared_ptr<BTNode>& def)
		{
			if (def)
				child_ = def->CreateInstance();
		}

	protected:
		std::unique_ptr<BTNodeInstance> child_;

		NodeStatus TickChild(BTContext& context, float deltaTime)
		{
			if (!child_)
				return NodeStatus::Failure;

			return child_->Tick(context, deltaTime);
		}
	};
}
