
//===== FILE: Core / StateMachine.hpp ===== 
#pragma once
#include <memory> 
#include <string>
#include <unordered_map>
#include <vector>
#include <functional>
#include <any> 
#include <cstdint>
namespace FSM {
	// 前向声明
	class State;
	class ITransition;
	class StateMachine;
	class Blackboard;
	class EventBus;

	// ============ 状态接口 ============
	class State {
	public:
		virtual ~State();

		// 生命周期回调
		virtual void OnEnter(const std::shared_ptr<Blackboard>& context);
		virtual void OnUpdate(float deltaTime, const std::shared_ptr<Blackboard>& context);
		virtual void OnExit(const std::shared_ptr<Blackboard>& context);

		// 控制是否允许切换
		virtual bool CanExit(const std::shared_ptr<Blackboard>& context) const;

		// 获取状态名称
		virtual const std::string& GetName() const;
	};

	// ============ C++ 状态实现 ============
	class CppState : public State {
	public:
		using EnterCallback = std::function<void(const std::shared_ptr<Blackboard>&)>;
		using UpdateCallback = std::function<void(float, const std::shared_ptr<Blackboard>&)>;
		using ExitCallback = std::function<void(const std::shared_ptr<Blackboard>&)>;
		using CanExitCallback = std::function<bool(const std::shared_ptr<Blackboard>&)>;

		CppState(const std::string& name);
		~CppState();

		void SetEnterCallback(EnterCallback cb);
		void SetUpdateCallback(UpdateCallback cb);
		void SetExitCallback(ExitCallback cb);
		void SetCanExitCallback(CanExitCallback cb);

		void OnEnter(const std::shared_ptr<Blackboard>& context) override;
		void OnUpdate(float deltaTime, const std::shared_ptr<Blackboard>& context) override;
		void OnExit(const std::shared_ptr<Blackboard>& context) override;

		bool CanExit(const std::shared_ptr<Blackboard>& context) const override;

		const std::string& GetName() const override;

	private:
		std::string m_name;
		EnterCallback m_onEnter;
		UpdateCallback m_onUpdate;
		ExitCallback m_onExit;
		CanExitCallback m_canExit;
	};

	// ============ 过渡接口 ============
	class ITransition {
	public:
		virtual ~ITransition();

		// 条件判断
		virtual bool IsTriggered(const std::shared_ptr<Blackboard>& context) const = 0;

		// 获取目标状态名
		virtual const std::string& GetTargetState() const = 0;

		// 获取优先级（值越大优先级越高）
		virtual int GetPriority() const;

		// 获取过渡名称
		virtual const std::string& GetName() const;
	};

	// ============ C++ 过渡实现 ============
	class CppTransition : public ITransition {
	public:
		using ConditionCallback = std::function<bool(const std::shared_ptr<Blackboard>&)>;

		CppTransition(const std::string& name, const std::string& targetState,
			ConditionCallback condition, int priority = 0);
		~CppTransition();

		bool IsTriggered(const std::shared_ptr<Blackboard>& context) const override;

		const std::string& GetTargetState() const override;
		int GetPriority() const override;
		const std::string& GetName() const override;

	private:
		std::string m_name;
		std::string m_targetState;
		ConditionCallback m_condition;
		int m_priority;
	};

	// ============ 黑板（共享数据） ============
	class Blackboard {
	public:
		using ValueType = std::any;

		Blackboard();
		~Blackboard();

		void Set(const std::string& key, const ValueType& value);
		ValueType Get(const std::string& key) const;
		bool Has(const std::string& key) const;
		void Remove(const std::string& key);
		void Clear();
		const std::unordered_map<std::string, ValueType>& GetAllData() const;

	private:
		std::unordered_map<std::string, ValueType> m_data;
	};

	// ============ 事件总线 ============
	class EventBus {
	public:
		using EventHandler = std::function<void(const std::string&, const std::any&)>;

		EventBus();
		~EventBus();

		void Subscribe(const std::string& eventType, EventHandler handler);
		void Publish(const std::string& eventType, const std::any& data = std::any());
		void Clear();

	private:
		std::unordered_map<std::string, std::vector<EventHandler>> m_subscribers;
	};

	// ============ 状态机 ============
	class StateMachine : public std::enable_shared_from_this<StateMachine> {
	public:
		StateMachine();
		~StateMachine();

		// 注册状态
		void AddState(const std::shared_ptr<State>& state);

		// 注册过渡
		void AddTransition(const std::shared_ptr<State>& fromState,
			const std::shared_ptr<ITransition>& transition);

		// 设置初始状态
		void SetInitialState(const std::string& stateName);

		// 获取当前状态
		std::shared_ptr<State> GetCurrentState() const;
		std::string GetCurrentStateName() const;

		// 尝试转移状态
		bool TryTransition(const std::string& targetStateName);

		// 更新状态机
		void Update(float deltaTime);

		// 获取黑板
		std::shared_ptr<Blackboard> GetBlackboard() const;

		// 获取事件总线
		std::shared_ptr<EventBus> GetEventBus() const;

		// 获取所有状态
		const std::unordered_map<std::string, std::shared_ptr<State>>& GetAllStates() const;

	private:
		std::unordered_map<std::string, std::shared_ptr<State>> m_states;
		std::unordered_map<std::string, std::vector<std::shared_ptr<ITransition>>> m_transitions;
		std::shared_ptr<State> m_currentState;
		std::shared_ptr<Blackboard> m_blackboard;
		std::shared_ptr<EventBus> m_eventBus;
	};

	// ============ 并行层管理 ============
	class ParallelLayer {
	public:
		ParallelLayer(const std::string& name);
		~ParallelLayer();

		void AddStateMachine(const std::string& key, const std::shared_ptr<StateMachine>& fsm);
		std::shared_ptr<StateMachine> GetStateMachine(const std::string& key) const;
		void Update(float deltaTime);
		const std::string& GetName() const;

	private:
		std::string m_name;
		std::unordered_map<std::string, std::shared_ptr<StateMachine>> m_stateMachines;
	};

	// ============ 状态栈（用于UI/游戏流程） ============
	class StateStack {
	public:
		StateStack();
		~StateStack();

		void Push(const std::shared_ptr<State>& state, const std::shared_ptr<Blackboard>& context);
		void Pop(const std::shared_ptr<Blackboard>& context);
		std::shared_ptr<State> Top() const;
		bool IsEmpty() const;
		size_t Size() const;
		void Clear(const std::shared_ptr<Blackboard>& context);

	private:
		std::vector<std::shared_ptr<State>> m_stack;
	};
} // namespace FSM