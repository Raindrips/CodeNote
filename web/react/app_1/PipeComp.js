function Son(prop)
{
    const [basefn] = prop;
    return (
        <div>
            <div>父组件属性:{basefn()}</div>
        </div>
    )
}

function Base(){
    return (
        <div className="base">
            
        </div>
    )
}