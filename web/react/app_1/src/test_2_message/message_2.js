import React, { useState } from 'react';
import eventBus from './EventBus'


function Child()
{
    const [parentSay, setParentSay] = useState('')
    React.useEffect(() =>
    {
        eventBus.on('parentSay', (value) =>
        {
            setParentSay(value)
        })
        return () => { eventBus.off('parentSay') }
    }, [])
    return <div className="Child">
        子组件:
        <div>收到父组件消息:{parentSay}</div>
        <input placeholder="向父组件说:" onChange={(e) =>
        {

            eventBus.emit('childSay', e.target.value);
        }} />

    </div>
}

function Parent()
{
    const [childSay, setChildSay] = useState('');
    React.useEffect(() =>
    {
        eventBus.on('childSay', (value) =>
        {
            setChildSay(value)
        })
        return () => { eventBus.off('childSay') }
    }, []);
    return <div className="Parent">
        父组件:
        <div>收到子组件消息:{childSay}</div>
        <input placeholder="对子组件说:" onChange={(e) =>
        {
            console.log(eventBus);
            eventBus.emit('parentSay', e.target.value)
        }} />
        <Child />
    </div>
}

export { Parent, Child } 