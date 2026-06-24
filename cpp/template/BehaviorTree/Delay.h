#pragma once
#include "behaviorTree.h"
#include "ActionNode.h"
namespace BT
{
    //--------------------------------------------------
    // Delay Node
    //--------------------------------------------------
    class DelayNode : public ActionNode
    {
    public:
        void SetDuration(float duration) { duration_ = duration; }

        std::unique_ptr<BTNodeInstance> CreateInstance() const override
        {
            struct Instance : public ActionNode::Instance
            {
                float duration_;
                float elapsed_ = 0.0f;

                Instance(const DelayNode* node)
                    : duration_(node->duration_)
                {
                }

                void OnEnter(BTContext& context) override
                {
                    elapsed_ = 0.0f;
                }

                NodeStatus OnUpdate(BTContext& context, float deltaTime) override
                {
                    elapsed_ += deltaTime;

                    if (elapsed_ >= duration_)
                        return NodeStatus::Success;

                    return NodeStatus::Running;
                }
            };

            return std::make_unique<Instance>(this);
        }

    private:
        float duration_ = 0.0f;
    };
}

