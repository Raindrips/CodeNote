import * as fs from 'fs';

class JsonStorage<T extends Record<string, any>> {
    private data: T;
    private filePath: string;

    constructor(filePath: string, defaultData: T) {
        this.filePath = filePath;
        this.data = this.loadFromFile() || defaultData;
    }

    // 从文件加载数据
    private loadFromFile(): T | null {
        try {
            if (fs.existsSync(this.filePath)) {
                const fileContent = fs.readFileSync(
                    this.filePath,
                    'utf-8',
                );
                return JSON.parse(fileContent) as T;
            }
        } catch (error) {
            console.error('读取文件失败:', error);
        }
        return null;
    }

    // 将数据存入文件
    private saveToFile(): void {
        try {
            fs.writeFileSync(
                this.filePath,
                JSON.stringify(this.data, null, 2),
                'utf-8',
            );
        } catch (error) {
            console.error('写入文件失败:', error);
        }
    }

    // 获取存储的数据
    getData(): T {
        return this.data;
    }

    // 设置整个数据对象
    setData(newData: T): void {
        this.data = newData;
        this.saveToFile();
    }

    // 更新某个 key 的值
    setKey<K extends keyof T>(key: K, value: T[K]): void {
        this.data[key] = value;
        this.saveToFile();
    }

    getKey<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }

    // 通过函数回调更新
    updateData(updateFn: (data: T) => void): void {
        updateFn(this.data);
        this.saveToFile();
    }
}

function testWrite() {
    // 示例使用
    const storage = new JsonStorage<{ name: string; age: number }>(
        'data.json',
        { name: '默认用户', age: 0 },
    );

    // 获取数据
    console.log('初始数据:', storage.getData());

    // 更新某个 key 的值
    storage.setKey('name', '李四');
    storage.setKey('age', 30);

    // 获取更新后的数据
    console.log('更新后的数据:', storage.getData());
}

function testRead() {
    const storage = new JsonStorage<{ name: string; age: number }>(
        'data.json',
        { name: '', age: 0 },
    );
    console.log(storage.getData());
}

// testWrite();

testRead();
