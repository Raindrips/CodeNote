import { FileCtrl } from "./src/FileCtrl";
import { FuncUtil } from "./src/FuncUtil";


async function main(folderPath: string) {
    const folderList = FileCtrl.getImageToFolderAll(folderPath);
    let map = new Map<string, string[]>();
    for (const folder of folderList) {
        let index: number = 2;
        let folderName = folder.folderName ;
        while (map.has(folderName)) {
            folderName = folder.folderName + index;
            index++;
        }
        map.set(folderName, folder.fileList);
    }
    for (const folder of map) {
        const folderName = folder[0];
        const fileList = folder[1];
        if (fileList.length == 0) {
            continue;
        }
        await FuncUtil.createPlistFile(fileList, folderName, folderPath);
    }
    console.log("done");
}

main(process.argv[2]);

