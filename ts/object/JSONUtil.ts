interface JSONObject {
    [key: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {}
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

class JSONUtil {
    // 1. 通过路径获取值
    static get(obj: JSONValue, path: string): JSONValue | undefined {
        const tokens = JSONUtil.parsePath(path);
        let current: any = obj;
        for (const token of tokens) {
            if (current == null) return undefined;
            if (typeof token === 'string') {
                if (!(token in current)) return undefined;
                current = current[token];
            } else {
                // array index
                if (
                    !Array.isArray(current) ||
                    token < 0 ||
                    token >= current.length
                )
                    return undefined;
                current = current[token];
            }
        }
        return current;
    }

    // 2. 检查路径是否存在
    static has(obj: JSONValue, path: string): boolean {
        return JSONUtil.get(obj, path) !== undefined;
    }

    // 3. 设置路径值，自动创建中间对象/数组
    static set(obj: JSONObject, path: string, value: JSONValue): void {
        const tokens = JSONUtil.parsePath(path);
        let current: any = obj;
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const isLast = i === tokens.length - 1;
            if (typeof token === 'string') {
                if (isLast) {
                    current[token] = value;
                } else {
                    if (!(token in current) || current[token] == null) {
                        // next token determines object or array
                        current[token] =
                            typeof tokens[i + 1] === 'number' ? [] : {};
                    }
                    current = current[token];
                }
            } else {
                // array index
                if (!Array.isArray(current))
                    throw new Error(
                        `Expected array at ${tokens
                            .slice(0, i)
                            .join('.')}`,
                    );
                if (token >= current.length) {
                    // expand array with nulls
                    while (current.length <= token) current.push(null);
                }
                if (isLast) {
                    current[token] = value;
                } else {
                    if (current[token] == null) {
                        current[token] =
                            typeof tokens[i + 1] === 'number' ? [] : {};
                    }
                    current = current[token];
                }
            }
        }
    }

    // 4. 查找 key，返回路径；strategy: 'bfs' | 'dfs'
    static findKey(
        obj: JSONValue,
        targetKey: string,
        strategy: 'bfs' | 'dfs' = 'bfs',
    ): string | null {
        type Frame = { node: any; path: string };
        if (strategy === 'bfs') {
            const queue: Frame[] = [{ node: obj, path: '' }];
            while (queue.length) {
                const { node, path } = queue.shift()!;
                if (node && typeof node === 'object') {
                    if (Array.isArray(node)) {
                        node.forEach((v, i) =>
                            queue.push({ node: v, path: `${path}[${i}]` }),
                        );
                    } else {
                        for (const k of Object.keys(node)) {
                            const subPath = path ? `${path}.${k}` : k;
                            if (k === targetKey) return subPath;
                            queue.push({ node: node[k], path: subPath });
                        }
                    }
                }
            }
        } else {
            // dfs
            function dfs(node: any, path: string): string | null {
                if (node && typeof node === 'object') {
                    if (Array.isArray(node)) {
                        for (let i = 0; i < node.length; i++) {
                            const p = `${path}[${i}]`;
                            const res = dfs(node[i], p);
                            if (res) return res;
                        }
                    } else {
                        for (const k of Object.keys(node)) {
                            const subPath = path ? `${path}.${k}` : k;
                            if (k === targetKey) return subPath;
                            const res = dfs(node[k], subPath);
                            if (res) return res;
                        }
                    }
                }
                return null;
            }
            return dfs(obj, '');
        }
        return null;
    }

    // Helper: parse "a.b[2].c" => ['a','b',2,'c']
    public static parsePath(path: string): Array<string | number> {
        const regex = /([^[.\]]+)|\[(\d+)\]/g;
        const tokens: Array<string | number> = [];
        let match: RegExpExecArray | null;
        while ((match = regex.exec(path))) {
            if (match[1] !== undefined) tokens.push(match[1]);
            else if (match[2] !== undefined) tokens.push(Number(match[2]));
        }
        return tokens;
    }
}

// AI提示词
/*
创建图片 typescripts 处理类似与json的object数据,包含下列功能
1.通过路径访问到指定key的值 字符串 "a.b.c[1]"  可以转化为 a.b.c[1],如果不存在则返回undefined
2. 检查路径下的key是否存在,  "a.b[0]" 返回true或false
3. 对路径进行覆写, "a.b.d" 值为 10,   则会根据路径访问到d,然后赋值为10.路径中间如果不存在则自动创建对象或数组元素.
4. 查找一个key,默认为广度优先,并返回其路径.第二个参数可以填写深度优先或广度优先.
*/
{
    function test() {
        const data: JSONObject | any = { a: { b: { c: [10, 20] } } };

        // 1. get
        console.log(JSONUtil.get(data, 'a.b.c[1]')); // 20
        console.log(JSONUtil.get(data, 'a.x.y')); // undefined

        // 2. has
        console.log(JSONUtil.has(data, 'a.b[0]')); // true
        console.log(JSONUtil.has(data, 'a.b[2]')); // false

        // 3. set
        JSONUtil.set(data, 'a.b.d', 30);
        console.log(data.a.b.d); // 30
        JSONUtil.set(data, 'a.e[2].f', 'hello');
        console.log(data.a.e); // [null, null, { f: "hello" }]

        // 4. findKey
        console.log(JSONUtil.findKey(data, 'f', 'bfs')); // "a.e[2].f"
        console.log(JSONUtil.findKey(data, 'c', 'dfs')); // "a.b.c"

        const data2 = {
            'a': [1, 2, 3, 4, 5],
            'b': { '1': 1, '2': 2, '3': 3 },
        };
        let a = JSONUtil.get(data2, 'a.[1]'); // 2
        let b = JSONUtil.get(data2, 'b.[1]'); // undefined
        console.log(a, b);
    }
    test();
}
