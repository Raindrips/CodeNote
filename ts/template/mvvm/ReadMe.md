## MVVM 管理器

### 基础功能

-   添加标签
-   删除标签
-   获取标签

-   通过全局路径添加值
-   获取全局路径值
-   设置全局路径值

-   冻结全部(不会发送事件)
-   激活全部(不会解除事件)

### 绑定功能

-   绑定(路径,事件名,组件)
-   解除绑定

## VM 视图

-   激活状态, 关闭则不发送事件
-   根路径激活通知
-   绑定回调
-   获取值
-   设置值

## 工具

1. 通过字符串进行路径解析
2. 通过字符串进行路径设置

## 扩展功能

-   VM 组件
    -   绑定的标签(有唯一性)
    -   被绑定的数据
    -   绑定成功回调
    -   解除绑定回调
    -   观察数据路径
    -   解除观察数据路径

### label

    - 监听路径 根据路径修改值,并做数字处理

### Event

-   监听路径
-   执行路径回调

## 从 tnt.framework 中学习到的

从 TNT 中学习框架

```typescript
// 数据劫持
vm.observe(userData, 'userData');

//cocos组件
// 自定义绑定监听
vm.bind(this, this.node.uiOpacity, 'userData.level', (opts) => {
    return opts.newValue > 3 ? 255 : 126;
});

// 绑定节点
vm.node(this, node, {
    angle: {
        watchPath: 'userData.level',
        formatter: (opts) => {
            return opts.newValue;
        },
    },
});

// 绑定label文字
vm.label(this, this.levelLabel, 'userData.level');

// 解除数据劫持
vm.violate('userData');

//解除绑定
vm.unbind(this.node);
```
