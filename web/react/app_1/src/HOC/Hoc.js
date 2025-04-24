import React from 'react';

// 高阶组件 (HOC) 是一个接受一个组件并返回一个新组件的函数
// HOC 是一种用于在组件之间共享通用功能而无需重复代码的模式
// HOC 可以用于跨多个组件共享逻辑，增强组件的功能，或提供额外的属性
// HOC 是 React 中的一种设计模式，允许我们在不修改原组件的情况下增强组件的功能

// HOC 是一个函数，接受一个组件作为参数，并返回一个新的组件
function HOC(WrappedComponent)
{
  return class Advance extends React.Component
  {
    state = {
      name: 'React State',
    }

    render()
    {
      return <WrappedComponent {...this.props} name={this.state.name} />;
    }

  };

}

class Index extends React.Component
{
  render()
  {
    return <div>Index</div>;
  }
}

// 使用 HOC 包装组件
export default HOC(Index);