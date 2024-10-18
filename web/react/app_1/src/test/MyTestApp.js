import React from "react";

const MyArray = ["hello", " world", "set", "get"]
function MyTestApp()
{
    return (
        <div className="App">
            <div>hello world</div>

            <React.Fragment>
                <div>Fragment</div>
            </React.Fragment>

            {/*这个是一段注释 */}
            this is a text

            {MyArray.map((v) => { return <div>{v}</div> })}

            <button onClick={onClick}>按钮</button>

            <FunComp></FunComp>
        </div>
    );
}

function onClick()
{
    console.log('on click');
}

function FunComp()
{
    return (
        <div>FunComp</div>
    )
}

export default MyTestApp;