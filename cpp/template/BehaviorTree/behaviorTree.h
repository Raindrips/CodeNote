#pragma once

#include <memory>
#include <vector>
#include <string>
#include <unordered_map>
#include <variant>
#include <cassert>


namespace BT
{

	enum class NodeStatus
	{
		Success,
		Failure,
		Running
	};

	//--------------------------------------------------
	// Blackboard
	//--------------------------------------------------
	class Blackboard
	{
	public:
		using Value = std::variant<int, float, bool, std::string>;

		template<typename T>
		void Set(const std::string& key, T value)
		{
			data_[key] = value;
		}

		template<typename T>
		T Get(const std::string& key) const
		{
			auto it = data_.find(key);
			assert(it != data_.end());
			return std::get<T>(it->second);
		}

		bool Has(const std::string& key) const
		{
			return data_.find(key) != data_.end();
		}

	private:
		std::unordered_map<std::string, Value> data_;
	};

	//--------------------------------------------------
	// Context
	//--------------------------------------------------
	struct BTContext
	{
		Blackboard* blackboard = nullptr;
	};


	class BTNodeInstance;

	//--------------------------------------------------
	// Node Definition（静态）
	//--------------------------------------------------
	class BTNode
	{
	public:
		virtual ~BTNode() = default;

		// 创建运行时实例
		virtual std::unique_ptr<BTNodeInstance> CreateInstance() const = 0;

		void SetName(const std::string& name) { name_ = name; }
		const std::string& GetName() const { return name_; }

	protected:
		std::string name_;
	};

	//--------------------------------------------------
	// Node Instance（运行时）
	//--------------------------------------------------
	class BTNodeInstance
	{
	public:
		virtual ~BTNodeInstance() = default;

		NodeStatus Tick(BTContext& context, float deltaTime)
		{
			if (!entered_)
			{
				OnEnter(context);
				entered_ = true;
			}

			status_ = OnUpdate(context, deltaTime);

			if (status_ != NodeStatus::Running)
			{
				OnExit(context);
				entered_ = false;
			}

			return status_;
		}

		NodeStatus GetStatus() const { return status_; }

	protected:
		virtual void OnEnter(BTContext& context) {}
		virtual NodeStatus OnUpdate(BTContext& context, float deltaTime) = 0;
		virtual void OnExit(BTContext& context) {}

	protected:
		NodeStatus status_ = NodeStatus::Running;
		bool entered_ = false;
	};

	//--------------------------------------------------
	// Composite Node Definition
	//--------------------------------------------------
	class CompositeNode : public BTNode
	{
	public:
		void AddChild(std::shared_ptr<BTNode> child)
		{
			children_.push_back(child);
		}

		const std::vector<std::shared_ptr<BTNode>>& GetChildren() const
		{
			return children_;
		}



	protected:

		std::vector<std::shared_ptr<BTNode>> children_;
	};

	//--------------------------------------------------
	// Composite Instance Base
	//--------------------------------------------------
	class CompositeNodeInstance : public BTNodeInstance
	{
	public:
		void InitChildren(const std::vector<std::shared_ptr<BTNode>>& defs)
		{
			for (const auto& def : defs)
			{
				children_.push_back(def->CreateInstance());
			}
		}

	protected:

		std::vector<std::unique_ptr<BTNodeInstance>> children_;
	};

	//--------------------------------------------------
	// BehaviorTree（根节点）
	//--------------------------------------------------
	class BehaviorTree : public CompositeNode
	{
	public:
		BehaviorTree()
		{
			context_.blackboard = &blackboard_;
		}

		void Initialize()
		{
			rootInstance_ = CreateInstance();
		}

		void Update(float deltaTime)
		{
			assert(rootInstance_);
			rootInstance_->Tick(context_, deltaTime);
		}

		Blackboard& GetBlackboard() { return blackboard_; }

		// 作为 Composite，需要实现 CreateInstance
		std::unique_ptr<BTNodeInstance> CreateInstance() const override
		{
			// 这里只创建 CompositeInstance，具体执行逻辑在后续阶段实现
			struct RootInstance : public CompositeNodeInstance
			{
				RootInstance(const BehaviorTree* tree)
				{
					InitChildren(tree->GetChildren());
				}

				NodeStatus OnUpdate(BTContext& context, float deltaTime) override
				{
					// 暂时简单执行第一个子节点
					if (children_.empty())
						return NodeStatus::Success;

					return children_[0]->Tick(context, deltaTime);
				}
			};

			return std::make_unique<RootInstance>(this);
		}

		/*  std::unique_ptr<BTNodeInstance> CreateInstance() const override
		  {
			  return std::make_unique<BehaviorTreeInstance>(this);
		  }*/

	private:
		Blackboard blackboard_;
		BTContext context_;
		std::unique_ptr<BTNodeInstance> rootInstance_;
	};

} // namespace BT