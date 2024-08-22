
import { ImageList } from "./image-list.js";

const getImageBlob = async (url) =>
{
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
        console.warn('image load error:' + url);
        throw new Error(
            `Image didn't load successfully; error code: ${imageResponse.statusText || imageResponse.status
            }`
        );
    }
    return imageResponse.blob();
};

const createImage = async function (imagePath)
{
    const imgSection = document.querySelector('section');
    const div = document.createElement('div');

    const myImage = document.createElement('img');
    const imageBlob = await getImageBlob(imagePath);
    myImage.src = window.URL.createObjectURL(imageBlob);
    div.append(myImage)
    imgSection.append(div);
}

// createImage("/res/test.png");
ImageList.map((val) => { createImage(val.url); })