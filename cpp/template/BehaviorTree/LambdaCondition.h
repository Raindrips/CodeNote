#pragma once
#include <functional>
#include "behaviorTree.h"
namespace BT {

	class LambdaConditionNode : public ConditionNode
	{
	public:
		using Func = std::function<bool(BTContext&)>;

		void SetFunction(Func func) { func_ = func; }

		std::unique_ptr<BTNodeInstance> CreateInstance() const override
		{
			struct Instance : public ConditionNode::Instance
			{
				Func func_;

				Instance(const LambdaConditionNode* node)
					: func_(node->func_)
				{
				}

				bool Evaluate(BTContext& context) override
				{
					return func_ ? func_(context) : false;
				}
			};

			return std::make_unique<Instance>(this);
		}

	private:
		Func func_;
	};
}

