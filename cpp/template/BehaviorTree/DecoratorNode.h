#pragma once
#include "behaviorTree.h"

namespace BT {

	//--------------------------------------------------
// Decorator Node
//--------------------------------------------------
	class DecoratorNode : public BTNode
	{
	public:
		void SetChild(std::shared_ptr<BTNode> child)
		{
			child_ = child;
		}

		const std::shared_ptr<BTNode>& GetChild() const
		{
			return child_;
		}

	protected:
		std::shared_ptr<BTNode> child_;
	};

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
	};
}
