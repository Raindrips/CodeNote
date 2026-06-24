#pragma once
#include "behaviorTree.h"
namespace BT {
    //--------------------------------------------------
// Composite Instance（带执行状态）
//--------------------------------------------------
    class CompositeNodeInstance : public BTNodeInstance
    {
    public:
        void InitChildren(const std::vector<std::shared_ptr<BTNode>>& defs)
        {
            children_.clear();
            children_.reserve(defs.size());

            for (const auto& def : defs)
            {
                children_.push_back(def->CreateInstance());
            }
        }

    protected:
        // 当前执行到哪个子节点（核心状态）
        size_t currentIndex_ = 0;

        // 子节点实例
        std::vector<std::unique_ptr<BTNodeInstance>> children_;

        void OnEnter(BTContext& context) override
        {
            currentIndex_ = 0;
        }

        void OnExit(BTContext& context) override
        {
            // 重置（防止复用问题）
            currentIndex_ = 0;
        }
    };
}