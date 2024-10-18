import icon_1 from '../img/icon_1.png';
import icon_2 from '../img/icon_2.png';


import { useState } from "react";
export default function MovingDot()
{
    const [position, setPosition] = useState({
        x: 0,
        y: 0
    });
    return (
        <>
            <div
                onPointerMove={e =>
                {
                    setPosition({
                        x: e.clientX,
                        y: e.clientY
                    });
                }}
                style={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                }}>
                <div style={{
                    position: 'absolute',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    left: -10,
                    top: -10,
                    width: 20,
                    height: 20,
                }}>
                    <img src={icon_1} alt='icon_1' />
                    <img src={icon_2} alt='icon_2' />
                    <img src={icon_1} alt='icon_1' />
                    <img src={icon_2} alt='icon_2' />
                    <img src={icon_1} alt='icon_1' />
                    <img src={icon_2} alt='icon_2' />
                </div>
            </div>
        </>
    )
}