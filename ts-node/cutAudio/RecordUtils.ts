export class RecordUtils {
    private records: Array<[number, number]> = []; // 存储开始和结束索引的数组，结束索引可能为undefined  

    start?: number;

    constructor(public readonly endFlag = 0) { }

    // 添加数据并处理索引  
    addData(data: number, index: number): void {
        //正在记录
        if (this.start) {
            if (data === this.endFlag) {
                //结束记录
                this.records.push([this.start, index]);
                this.start = undefined
            }
        }
        //不在记录
        else {
            if (data === this.endFlag) return;
            this.start = index;
        }
    }

    stop(index: number) {
        if (this.start) {
            this.records.push([this.start, index]);
        }
    }

    // 获取所有记录  
    getRecords(): Array<[number, number]> {
        return this.records;
    }

    format(arr: Array<[number, number]>) {
        // let n = copy2DArray(arr);
        let n: string[][] = []
        arr.forEach((ar, i) => {
            n[i] = []
            ar.forEach((v, j) => {
                let str = formatTime(Math.floor(v / 12 * 1000));
                // let str=v+''
                n[i][j] = str;
            })
        })
        return n
    }



    // 可选：清理所有记录  
    clearRecords(): void {
        this.records = [];
    }
}

function copy2DArray<T>(arr: T[][]): T[][] {
    return arr.map(row => [...row.map(item => (Array.isArray(item) ? copy2DArray([item as any[]]) : item) as T)]);
}

// let record = new RecordUtils();

// let data = [0, 0, 0, 1, 2, 3, 5, 0, 0, 0, 2, 3, 4, 5, 0, 0, 8];
// let i = 0
// for (const d of data) {
//     record.addData(d, i)
//     i++;
// }
// record.stop(data.length);
// console.log(record.getRecords())

function point(val: number, n: number = 2) {
    const p = n * Math.pow(10, n);
    return Math.round(val * p) / p;
}

function formatTime(milliseconds: number): string {
    // 计算总秒数  
    const totalSeconds = Math.floor(milliseconds / 1000);

    // 计算小时数  
    const hours = Math.floor(totalSeconds / 3600);

    // 计算剩余分钟数  
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    // 计算剩余秒数  
    const seconds = Math.floor(totalSeconds % 60);

    // 计算剩余的毫秒数  
    const remainingMilliseconds = milliseconds % 1000;
    const pad = (n: number) => { return padStart(n, 2, '0') }
    // 格式化并返回结果  
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(remainingMilliseconds)}`;
}

export function padStart(str: string | number, length: number, padString: string) {
    let s = str.toString();
    // 如果字符串长度已达到或超过目标长度，则直接返回原始字符串
    if (s.length >= length) {
        return s;
    }
    // 计算需要填充的长度
    const paddingLength = length - s.length;
    // 生成填充字符串
    const paddingString = padString.repeat(Math.ceil(paddingLength / padString.length)).slice(0, paddingLength);

    return paddingString + s;
}