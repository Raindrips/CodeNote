

// 组件基类
class Component {}

// 组件管理器
class ComponentManager {
    private components: Map<string, Component[]> = new Map();

    addComponent(component: Component) {
        const type = component.constructor.name;
        if (!this.components.has(type)) {
            this.components.set(type, []);
        }
        this.components.get(type)!.push(component);
    }

    getComponents(type: string): Component[] {
        return this.components.get(type) || [];
    }
}

// 示例子类
class MyComponent extends Component {
    constructor(public name: string) { super(); }
}

// 测试
const manager = new ComponentManager();
manager.addComponent(new MyComponent('A'));
manager.addComponent(new MyComponent('B'));
console.log(manager.getComponents('MyComponent'));
