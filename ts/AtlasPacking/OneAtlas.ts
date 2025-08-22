
import { FileCtrl } from "./src/FileCtrl";
import { FuncUtil } from "./src/FuncUtil";


async function main(folderPath: string, outFlieName: string) {
    const imagePathList: string[] = FileCtrl.getImageToFolder(folderPath);
    await FuncUtil.createPlistFile(imagePathList, outFlieName, folderPath);
}
main(process.argv[2], process.argv[3]);
