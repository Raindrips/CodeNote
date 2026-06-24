#pragma once
#include "behaviorTree.h"
#include "DecoratorNodeInstance.h"
#include "DecoratorNode.h"

namespace BT {
    class RepeatNode : public DecoratorNode
    {
    public:
        void SetRepeatCount(int count) { repeatCount_ = count; }

        std::unique_ptr<BTNodeInstance> CreateInstance() const override
        {
            struct Instance : public DecoratorNodeInstance
            {
                int repeatCount_;
                int currentCount_ = 0;

                Instance(const RepeatNode* node)
                    : repeatCount_(node->repeatCount_)
                {
                    InitChild(node->GetChild());
                }

                void OnEnter(BTContext& context) override
                {
                    currentCount_ = 0;
                }

                NodeStatus OnUpdate(BTContext& context, float deltaTime) override
                {
                    while (currentCount_ < repeatCount_)
                    {
                        NodeStatus status = TickChild(context, deltaTime);

                        if (status == NodeStatus::Running)
                            return NodeStatus::Running;

                        if (status == NodeStatus::Failure)
                            return NodeStatus::Failure;

                        currentCount_++;
                    }

                    return NodeStatus::Success;
                }
            };

            return std::make_unique<Instance>(this);
        }

    private:
        int repeatCount_ = 1;
    };
}