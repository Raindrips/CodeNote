#pragma once
#include "behaviorTree.h"

namespace BT {
	//--------------------------------------------------
// Parallel Node
//--------------------------------------------------
	class ParallelNode : public CompositeNode
	{
	public:
		enum class Policy
		{
			AllSuccess,
			AnySuccess
		};

		void SetPolicy(Policy policy) { policy_ = policy; }

		std::unique_ptr<BTNodeInstance> CreateInstance() const override
		{
			struct Instance : public CompositeNodeInstance
			{
				Policy policy_;

				Instance(const ParallelNode* node)
					: policy_(node->policy_)
				{
					InitChildren(node->GetChildren());
				}

				NodeStatus OnUpdate(BTContext& context, float deltaTime) override
				{
					bool anyRunning = false;
					bool anySuccess = false;

					for (auto& child : children_)
					{
						NodeStatus status = child->Tick(context, deltaTime);

						if (status == NodeStatus::Running)
							anyRunning = true;

						if (status == NodeStatus::Success)
							anySuccess = true;

						if (status == NodeStatus::Failure)
							return NodeStatus::Failure; // 默认失败中断
					}

					if (policy_ == Policy::AllSuccess)
					{
						if (!anyRunning)
							return NodeStatus::Success;
					}
					else // AnySuccess
					{
						if (anySuccess)
							return NodeStatus::Success;
					}

					return NodeStatus::Running;
				}
			};

			return std::make_unique<Instance>(this);
		}

	private:
		Policy policy_ = Policy::AllSuccess;
	};
}

