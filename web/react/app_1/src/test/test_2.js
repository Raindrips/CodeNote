
import  icon_1  from '../img/icon_1.png'
import  icon_2  from '../img/icon_2.png'



export function Profile({ person })
{
    return (
        <div>
            <Header name={person.name} />
            <Avatar image={person.image} name={person.name} />
        </div>
    )
}

function Header({ name })
{
    return <h1>{name}</h1>;
}

function Avatar({ img, name })
{
    return (
        <img
            className="avatar"
            src={img}
            alt={name}
            width={50}
            height={50}
        />
    );
}

export default function Test2()
{
    return (
        <>
            <Profile person={{
                image: { icon_1 },
                name: 'Subrahmanyan Chandrasekhar',
            }} />
            <Profile person={{
                image: { icon_2 },
                name: 'Creola Katherine Johnson',
            }} />
        </>
    )
}
