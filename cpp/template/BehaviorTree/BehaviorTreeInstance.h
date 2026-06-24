#pragma once

#include "behaviorTree.h"
namespace BT
{
	class BehaviorTreeInstance : public CompositeNodeInstance
	{
	public:
		BehaviorTreeInstance(const BehaviorTree* tree)
		{
			InitChildren(tree->GetChildren());
		}

		/*
		std::unique_ptr<BTNodeInstance> CreateInstance() const
			{
				return std::make_unique<BehaviorTreeInstance>(this);
			}
		*/

	protected:
		NodeStatus OnUpdate(BTContext& context, float deltaTime) override
		{
			if (children_.empty())
				return NodeStatus::Success;

			// Root 默认执行第一个子节点（通常是 Sequence）
			return children_[0]->Tick(context, deltaTime);
		}
	};
}