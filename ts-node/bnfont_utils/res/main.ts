import { parseFntData } from "./bmfontParse";
import { generateFntContent } from "./bmfontSave";
import { FntData } from "./FntData";
import { readFile } from "./readFile";

const filePath = `E:\\win.fnt`;

async function main(){
    let data=await readFile(filePath);
    console.log(data);
    let fntData=parseFntData(data);
    console.log(fntData)
    formatData(fntData)
    let bmFont=generateFntContent(fntData)
    console.log(bmFont);
}

function formatData(fntData:FntData){
    let maxWidth=0;
    for (const char of fntData.chars){
        maxWidth=Math.max(char.width,maxWidth);
    }
    console.log('maxWidth',maxWidth);
    for (const char of fntData.chars){
        if(char.id=='.'.charCodeAt(0)||char.id==','.charCodeAt(0)){
            continue;
        }
        char.xadvance=maxWidth;
        char.xoffset=maxWidth-char.width;
    }
}

main();