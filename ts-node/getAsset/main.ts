import { readJsonFile } from './fileCtrl/readFile';
import {writeTextFile, writeSpineFile} from './fileCtrl/writeFile';

const url: string = "104.har"


function main() {

    readJsonFile(url, (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) {
            console.log(err);
            return;
        }
        const har = JSON.parse(data);
        const entries: any[] = har.log.entries;
        let set: Set<string> = new Set();
        entries.forEach((item:any, index: number) => {
            // console.log(index);
            // console.log(item);
            set.add(parseObj(item, index)) ;
        })
        console.log(set);
        console.log(set.size);
    })
}

function parseObj(item: any, index: number): string {
    if (!item.response) {
        console.log(index,"is not response");
        return "";
    }
    let response = item.response;
    let content = response.content;
    if (!content) {
        console.log(index,"is not content");
        return "";
    }

    let extension: string = '';
    extension.includes
    if (content.mimeType.includes('javascript')) extension = 'js';
    else if (content.mimeType.includes('html')) extension = 'html';
    else if (content.mimeType.includes('css')) extension = 'css';
    else if (content.mimeType.includes('json')) extension = 'json';
    else if (content.mimeType.includes('image/png')) extension = 'png';
    else if (content.mimeType.includes('image/jpeg')) extension = 'jpg';
    else {
        return content.mimeType;
    }   
    if (extension != "json") {
        return content.mimeType;
    }
    const fileName = `./out/json/json_${index}.${extension}`;

    // writeTextFile(fileName, content.text);
    console.log(content.text);
    writeSpineFile("./out/spine/" + index, content.text)

    return "json"
}



main();

