//子组件

import { useState } from "react";


// 通过 props 属性参数进行数据通信,将回调函数传递给子组件进行调用

function Child(props)
{
    const { parentSay, sayToParent } = props;
    return <div className="Child">
        子组件:
        <div>收到父组件消息:{parentSay}</div>
        <input placeholder="向父组件说:" onChange={(e) =>
        {
            sayToParent(e.target.value)
        }} />

    </div>
}

function Parent()
{
    const [childSay, setChildSay] = useState('');
    const [parentSay, setParentSay] = useState('');

    return <div className="Parent">
        父组件:
        <div>收到父组件消息:{childSay}</div>
        <input placeholder="对子组件说:" onChange={(e) => setParentSay(e.target.value)} />
        <Child parentSay={parentSay} sayToParent={setChildSay} />
    </div>
}

export { Parent, Child } 