#include "pch.h"
//#include "StateMachine.h"

//==== = FILE: Core / StateMachine.cpp ==== = 
#include "StateMachine.hpp"
#include <algorithm>
namespace FSM {
	// State

	// State::~State()
	State::~State() {
	}

	void State::OnEnter(const std::shared_ptr<Blackboard>& context) {
	}

	void State::OnUpdate(float deltaTime, const std::shared_ptr<Blackboard>& context) {
	}

	void State::OnExit(const std::shared_ptr<Blackboard>& context) {
	}

	bool State::CanExit(const std::shared_ptr<Blackboard>& context) const {

		return true;
	}

	// const std::string& State::GetName() const
	const std::string& State::GetName() const {
		static std::string name = "State";
		return name;
	}

	// CppState

	// CppState::CppState(const std::string& name)
	CppState::CppState(const std::string& name)
		: m_name(name), m_onEnter(), m_onUpdate(), m_onExit(), m_canExit() {
	}

	// CppState::~CppState()
	CppState::~CppState() {
	}

	// void CppState::SetEnterCallback(EnterCallback cb)
	void CppState::SetEnterCallback(EnterCallback cb) {
		m_onEnter = cb;
	}

	// void CppState::SetUpdateCallback(UpdateCallback cb)
	void CppState::SetUpdateCallback(UpdateCallback cb) {
		m_onUpdate = cb;
	}

	// void CppState::SetExitCallback(ExitCallback cb)
	void CppState::SetExitCallback(ExitCallback cb) {
		m_onExit = cb;
	}

	// void CppState::SetCanExitCallback(CanExitCallback cb)
	void CppState::SetCanExitCallback(CanExitCallback cb) {
		m_canExit = cb;
	}

	// void CppState::OnEnter(const std::shared_ptr<Blackboard>& context)
	void CppState::OnEnter(const std::shared_ptr<Blackboard>& context) {
		if (m_onEnter) m_onEnter(context);
	}

	// void CppState::OnUpdate(float deltaTime, const std::shared_ptr<Blackboard>& context)
	void CppState::OnUpdate(float deltaTime, const std::shared_ptr<Blackboard>& context) {
		if (m_onUpdate) m_onUpdate(deltaTime, context);
	}

	// void CppState::OnExit(const std::shared_ptr<Blackboard>& context)
	void CppState::OnExit(const std::shared_ptr<Blackboard>& context) {
		if (m_onExit) m_onExit(context);
	}

	// bool CppState::CanExit(const std::shared_ptr<Blackboard>& context) const
	bool CppState::CanExit(const std::shared_ptr<Blackboard>& context) const {
		if (m_canExit) return m_canExit(context);
		return true;
	}

	// const std::string& CppState::GetName() const
	const std::string& CppState::GetName() const {
		return m_name;
	}

	// Transition

	// Transition::~Transition()
	ITransition::~ITransition() {
	}

	// int Transition::GetPriority() const
	int ITransition::GetPriority() const {
		return 0;
	}

	// const std::string& Transition::GetName() const
	const std::string& ITransition::GetName() const {
		static std::string name = "Transition";
		return name;
	}

	// CppTransition

	CppTransition::CppTransition(const std::string& name, const std::string& targetState,
		ConditionCallback condition, int priority)
		: m_name(name), m_targetState(targetState), m_condition(condition), m_priority(priority) {
	}

	CppTransition::~CppTransition() {
	}

	bool CppTransition::IsTriggered(const std::shared_ptr<Blackboard>& context) const {
		return m_condition ? m_condition(context) : true;
	}

	const std::string& CppTransition::GetTargetState() const {
		return m_targetState;
	}

	int CppTransition::GetPriority() const {
		return m_priority;
	}

	// const std::string& CppTransition::GetName() const
	const std::string& CppTransition::GetName() const {
		return m_name;
	}

	// Blackboard

	// Blackboard::Blackboard()
	Blackboard::Blackboard() {
	}

	// Blackboard::~Blackboard()
	Blackboard::~Blackboard() {
	}

	// void Blackboard::Set(const std::string& key, const ValueType& value)
	void Blackboard::Set(const std::string& key, const ValueType& value) {
		m_data[key] = value;
	}

	// Blackboard::ValueType Blackboard::Get(const std::string& key) const
	Blackboard::ValueType Blackboard::Get(const std::string& key) const {
		auto it = m_data.find(key);
		if (it != m_data.end()) {
			return it->second;
		}
		return ValueType();
	}

	// bool Blackboard::Has(const std::string& key) const
	bool Blackboard::Has(const std::string& key) const {
		return m_data.find(key) != m_data.end();
	}

	// void Blackboard::Remove(const std::string& key)
	void Blackboard::Remove(const std::string& key) {
		m_data.erase(key);
	}

	// void Blackboard::Clear()
	void Blackboard::Clear() {
		m_data.clear();
	}

	// const std::unordered_map<std::string, Blackboard::ValueType>& Blackboard::GetAllData() const
	const std::unordered_map<std::string, Blackboard::ValueType>& Blackboard::GetAllData() const {
		return m_data;
	}

	// EventBus

	// EventBus::EventBus()
	EventBus::EventBus() {
	}

	// EventBus::~EventBus()
	EventBus::~EventBus() {
	}

	// void EventBus::Subscribe(const std::string& eventType, EventHandler handler)
	void EventBus::Subscribe(const std::string& eventType, EventHandler handler) {
		m_subscribers[eventType].push_back(handler);
	}

	// void EventBus::Publish(const std::string& eventType, const std::any& data)
	void EventBus::Publish(const std::string& eventType, const std::any& data) {
		auto it = m_subscribers.find(eventType);
		if (it != m_subscribers.end()) {
			for (auto& handler : it->second) {
				handler(eventType, data);
			}
		}
	}

	// void EventBus::Clear()
	void EventBus::Clear() {
		m_subscribers.clear();
	}

	// StateMachine

	// StateMachine::StateMachine()
	StateMachine::StateMachine()
		: m_currentState(nullptr),
		m_blackboard(std::make_shared<Blackboard>()),
		m_eventBus(std::make_shared<EventBus>()) {
	}

	// StateMachine::~StateMachine()
	StateMachine::~StateMachine() {
	}

	// void StateMachine::AddState(const std::shared_ptr<State>& state)
	void StateMachine::AddState(const std::shared_ptr<State>& state) {
		if (state) {
			m_states[state->GetName()] = state;
		}
	}

	// void StateMachine::AddTransition(const std::shared_ptr<State>& fromState, const std::shared_ptr<Transition>& transition)
	void StateMachine::AddTransition(const std::shared_ptr<State>& fromState,
		const std::shared_ptr<ITransition>& transition) {
		if (fromState && transition) {
			auto& transitions = m_transitions[fromState->GetName()];
			transitions.push_back(transition);
			// 按优先级排序（高优先级在前）
			std::sort(transitions.begin(), transitions.end(),
				[](const auto& a, const auto& b) {
					return a->GetPriority() > b->GetPriority();
				});
		}
	}

	// void StateMachine::SetInitialState(const std::string& stateName)
	void StateMachine::SetInitialState(const std::string& stateName) {
		if (m_states.find(stateName) != m_states.end()) {
			m_currentState = m_states[stateName];
			if (m_currentState) {
				m_currentState->OnEnter(m_blackboard);
				m_eventBus->Publish("OnStateEnter", stateName);
			}
		}
	}

	// std::shared_ptr<State> StateMachine::GetCurrentState() const
	std::shared_ptr<State> StateMachine::GetCurrentState() const {
		return m_currentState;
	}

	// std::string StateMachine::GetCurrentStateName() const
	std::string StateMachine::GetCurrentStateName() const {
		return m_currentState ? m_currentState->GetName() : "";
	}

	// bool StateMachine::TryTransition(const std::string& targetStateName)
	bool StateMachine::TryTransition(const std::string& targetStateName) {
		if (!m_currentState) return false;

		auto it = m_states.find(targetStateName);
		if (it == m_states.end()) return false;

		// 检查是否允许退出当前状态
		if (!m_currentState->CanExit(m_blackboard)) {
			m_eventBus->Publish("OnTransitionBlocked", targetStateName);
			return false;
		}

		// 执行退出和进入回调
		m_currentState->OnExit(m_blackboard);
		m_eventBus->Publish("OnStateExit", m_currentState->GetName());

		m_currentState = it->second;
		m_currentState->OnEnter(m_blackboard);
		m_eventBus->Publish("OnStateEnter", targetStateName);

		return true;
	}

	// void StateMachine::Update(float deltaTime)
	void StateMachine::Update(float deltaTime) {
		if (!m_currentState) return;

		// 更新当前状态
		m_currentState->OnUpdate(deltaTime, m_blackboard);

		// 检查过渡
		auto it = m_transitions.find(m_currentState->GetName());
		if (it != m_transitions.end()) {
			for (const auto& transition : it->second) {
				if (transition->IsTriggered(m_blackboard)) {
					TryTransition(transition->GetTargetState());
					break; // 优先级最高的触发后停止检查
				}
			}
		}
	}

	// std::shared_ptr<Blackboard> StateMachine::GetBlackboard() const
	std::shared_ptr<Blackboard> StateMachine::GetBlackboard() const {
		return m_blackboard;
	}

	// std::shared_ptr<EventBus> StateMachine::GetEventBus() const
	std::shared_ptr<EventBus> StateMachine::GetEventBus() const {
		return m_eventBus;
	}

	// const std::unordered_map<std::string, std::shared_ptr<State>>& StateMachine::GetAllStates() const
	const std::unordered_map<std::string, std::shared_ptr<State>>& StateMachine::GetAllStates() const {
		return m_states;
	}

	// ParallelLayer

	ParallelLayer::ParallelLayer(const std::string& name)
		: m_name(name) {
	}

	ParallelLayer::~ParallelLayer() {
	}

	void ParallelLayer::AddStateMachine(const std::string& key, const std::shared_ptr<StateMachine>& fsm) {
		m_stateMachines[key] = fsm;
	}

	std::shared_ptr<StateMachine> ParallelLayer::GetStateMachine(const std::string& key) const {
		auto it = m_stateMachines.find(key);
		if (it != m_stateMachines.end()) {
			return it->second;
		}
		return nullptr;
	}

	void ParallelLayer::Update(float deltaTime) {
		for (auto& pair : m_stateMachines) {
			if (pair.second) {
				pair.second->Update(deltaTime);
			}
		}
	}

	const std::string& ParallelLayer::GetName() const {
		return m_name;
	}

	// StateStack
	StateStack::StateStack() {
	}

	StateStack::~StateStack() {
	}

	void StateStack::Push(const std::shared_ptr<State>& state, const std::shared_ptr<Blackboard>& context) {
		if (state) {
			state->OnEnter(context);
			m_stack.push_back(state);
		}
	}

	void StateStack::Pop(const std::shared_ptr<Blackboard>& context) {
		if (!m_stack.empty()) {
			m_stack.back()->OnExit(context);
			m_stack.pop_back();
		}
	}

	std::shared_ptr<State> StateStack::Top() const {
		return m_stack.empty() ? nullptr : m_stack.back();
	}

	bool StateStack::IsEmpty() const {
		return m_stack.empty();
	}

	size_t StateStack::Size() const {
		return m_stack.size();
	}

	void StateStack::Clear(const std::shared_ptr<Blackboard>& context) {
		while (!m_stack.empty()) {
			Pop(context);
		}
	}
} // namespace FSM
