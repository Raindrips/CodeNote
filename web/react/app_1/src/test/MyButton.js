
import { useState } from 'react';




export default function MyButton()
{
    const [index, setIndex] = useState(0);

    return (
        <Toolbar
            onPlayMovie={() => { setIndex(index+1); alert('Playing! ' + index); }}
            onUploadImage={() => { setIndex(index+1); alert('Uploading! ' + index) }}
        />
    );
}

function Toolbar({ onPlayMovie, onUploadImage })
{
    return (
        <div>
            <Button onClick={onPlayMovie}>
                Play Movie
            </Button>
            <Button onClick={onUploadImage}>
                Upload Image
            </Button>
        </div>
    );
}

function Button({ onClick, children })
{
    return (
        <button onClick={onClick}>
            {children}
        </button>
    );
}