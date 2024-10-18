// 函数内部仅进行数据操作
// return 只做渲染
export function Clock({ time })
{
    let className =""
    let hours = time.getHours();
    if (hours >= 0 && hours <= 6) {
        className = 'night';
    } else {
        className = 'day';
    }
    return (
        <h1 id="time" 
            className={className}>
            {time.toLocaleTimeString()}
        </h1>
    );
}


export default function Test()
{
    const date=new Date()
    return <Clock time={date}/>
} 