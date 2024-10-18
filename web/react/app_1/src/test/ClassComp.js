import * as React from 'react';
class ClassComp extends React.Component
{

    text = "text"
    render()
    {
        return <div onClick={this.say}>{this.text}</div>
    }

    say()
    {
        console.log('hello');
    }
}

export default ClassComp