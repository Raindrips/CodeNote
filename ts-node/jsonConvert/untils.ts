import fs from 'fs';
export class JsonConvert {
    readFile(path: string) {
        let buf = fs.readFileSync(path);
        return buf;
    }

    saveFile(text: string) {
        const path = './output.json';
        fs.writeFile(path, text, (err) => {
            if (err) {
                console.log('write error ' + err)
            }
            console.log(path);
        })
    }
    jsonToObject(text: string) {
        let obj = JSON.parse(text)
        return obj;
    }

    filterString(str: string) {
        let pattern = /[^\u4E00-\u9FA5A-Za-z0-9_ ,.]+/g
        let s = ''
        if (str) {
            s = String(str).replace(pattern, ' ')
        }
        if (!s) s = '';
        return s;

    }

    getArgs() {
        let path = process.argv[2];
        if (!path) path = ''
        return path;
    }

    public filterJSON(text: string) {
        let filter = '';
        let obj = JSON.parse(text)
        let keyArray = Object.keys(obj)
        for (const key of keyArray) {
            const value = this.filterString(obj[key])
            filter += `"${key}":"${value}",\n`
        }
        return filter;
    }

    public exec() {
        let path: string = this.getArgs();
        if (!path) {
            console.log('please input path')
            return;
        }
        this.getArgs()
        let buffer = this.readFile(path)
        let text = this.filterJSON(buffer.toString());
        this.saveFile(text);
    }


}

// json去除特殊符号
export function main() {
    let jsonValue = new JsonConvert()
    jsonValue.exec();
}

main();