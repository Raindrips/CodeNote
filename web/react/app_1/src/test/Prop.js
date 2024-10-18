import img from '../img/icon_1.png';

export function Avatar({name, size})
{
    return (
        <img
            className="avatar"
            src={img}
            alt="orange"
            width={size}
            height={size}
        />
    );
}
// export default Avatar