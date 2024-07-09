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
        let n = copy2DArray(arr);
        n.forEach((arr, i) => {
            arr.forEach((v, j) => {
                v = point(v / 12)
                n[i][j] = v;
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