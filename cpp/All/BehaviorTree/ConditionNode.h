#pragma once
#include "behaviorTree.h"
namespace BT
{
    class ConditionNode : public BTNode
    {
    public:
        class Instance : public BTNodeInstance
        {
        protected:
            NodeStatus OnUpdate(BTContext& context, float deltaTime) override
            {
                bool result = Evaluate(context);
                return result ? NodeStatus::Success : NodeStatus::Failure;
            }

            virtual bool Evaluate(BTContext& context) = 0;
        };
    };
}