//React 组件是常规的 JavaScript 函数，但 组件的名称必须以大写字母开头，否则它们将无法运行！

function First1()
{
    return <section>
        <MyBox />
        <MyBox />
        <MyBox />
        <MyBox />
        <MyBox />
        {/* {MyBox()}
        {MyBox()}
        {MyBox()}
        {MyBox()} */}
    </section>
}

function MyBox()
{
    return <div>123456</div>
}

export default First1;