#pragma once
#include "behaviorTree.h"


namespace BT {
    class SelectorNode : public CompositeNode
    {
    public:
        std::unique_ptr<BTNodeInstance> CreateInstance() const override
        {
            struct Instance : public CompositeNodeInstance
            {
                Instance(const SelectorNode* node)
                {
                    InitChildren(node->GetChildren());
                }

                NodeStatus OnUpdate(BTContext& context, float deltaTime) override
                {
                    while (currentIndex_ < children_.size())
                    {
                        NodeStatus status = children_[currentIndex_]->Tick(context, deltaTime);

                        if (status == NodeStatus::Running)
                            return NodeStatus::Running;

                        if (status == NodeStatus::Success)
                            return NodeStatus::Success;

                        // Failure → 下一个
                        currentIndex_++;
                    }

                    return NodeStatus::Failure;
                }
            };

            return std::make_unique<Instance>(this);
        }
    };
}