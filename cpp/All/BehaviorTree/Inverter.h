#pragma once
#include "behaviorTree.h"
#include "DecoratorNode.h"

namespace BT {
    //--------------------------------------------------
// Inverter Node
//--------------------------------------------------
    class InverterNode : public DecoratorNode
    {
    public:
        std::unique_ptr<BTNodeInstance> CreateInstance() const override
        {
            struct Instance : public DecoratorNodeInstance
            {
                Instance(const InverterNode* node)
                {
                    InitChild(node->GetChild());
                }

                NodeStatus OnUpdate(BTContext& context, float deltaTime) override
                {
                    NodeStatus status = TickChild(context, deltaTime);

                    if (status == NodeStatus::Success)
                        return NodeStatus::Failure;

                    if (status == NodeStatus::Failure)
                        return NodeStatus::Success;

                    return NodeStatus::Running;
                }
            };

            return std::make_unique<Instance>(this);
        }
    };
}
