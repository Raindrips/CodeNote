import fs from 'fs';
import { checkSpineFile, checkSpineData, getSpineData, getSpineJsonData, getSpineAtlasData } from './spineFileCtrl';

export function writeTextFile(url: string, data: string) {
    fs.writeFile(url, data, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File written successfully\n');
        }
    });
}

export function writeJsonFile(url: string, data: string) {
    writeTextFile(url + ".json", data);
}

export function writeAtlasFile(url: string, data: string) {
    writeTextFile(url + ".atlas", data);

}

export function writePngFile(url: string, data: Buffer) {
    fs.writeFile(url, data, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File written successfully\n');
        }
    });
}

export function writeSpineFile(url: string, data: string) {
    try{
        let obj: any = JSON.parse(data)
    if (Array.isArray(obj)) {
        let boo: boolean = checkSpineFile(obj)
        if (boo) {
            writeJsonFile(url,data)
            // console.log(boo)
            let spineData: any[] = [];
            if (checkSpineData(obj)) {
                spineData = obj;
            }else {
                spineData = getSpineData(obj);
            }
            let spineJsonData: string = getSpineJsonData(spineData);
            let spineAtlasData: string = getSpineAtlasData(spineData);
            writeJsonFile(url+ "_spine", JSON.stringify(spineJsonData));
            writeAtlasFile(url+ "_spine", JSON.stringify(spineAtlasData));
        
        }
    }
    }catch(e){

    }
    
    
}

