export function Clock({ time })
{
    return (
        <div>
            <h1>{time}</h1>
            <input />
        </div>
    );
}

export default function Test4()
{
    const date = new Date();
    return <Clock time={date.toLocaleString()} />
}