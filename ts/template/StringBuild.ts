(() => {
    class StringBuilder {
        private buffer: string[] = [];

        constructor(s?: string) {
            s && this.append(s);
        }

        /** 返回一个支持下标访问的代理实例 */
        static create(
            s?: string,
        ): StringBuilder & { [index: number]: string } {
            const sb = new StringBuilder(s);
            return new Proxy(sb, {
                get(target, prop, receiver) {
                    if (
                        typeof prop === 'string' &&
                        /^[0-9]+$/.test(prop)
                    ) {
                        return target.at(Number(prop));
                    }
                    return Reflect.get(target, prop, receiver);
                },
                set(target, prop, value, receiver) {
                    if (
                        typeof prop === 'string' &&
                        /^[0-9]+$/.test(prop)
                    ) {
                        target.setChar(Number(prop), String(value));
                        return true;
                    }
                    return Reflect.set(target, prop, value, receiver);
                },
            }) as any;
        }

        append(str: string): this {
            this.buffer.push(...str);
            return this;
        }

        at(i: number): string | undefined {
            return this.buffer[i];
        }

        setChar(i: number, c: string): this {
            this.buffer[i] = c.charAt(0);
            return this;
        }

        substring(start: number, end?: number): string {
            return this.buffer.slice(start, end).join('');
        }

        indexOf(search: string, fromIndex = 0): number {
            return this.toString().indexOf(search, fromIndex);
        }

        includes(search: string): boolean {
            return this.indexOf(search) !== -1;
        }

        startsWith(prefix: string): boolean {
            return this.toString().startsWith(prefix);
        }

        endsWith(suffix: string): boolean {
            return this.toString().endsWith(suffix);
        }

        insert(index: number, str: string): this {
            this.buffer.splice(index, 0, ...str);
            return this;
        }

        remove(start: number, length = 1): this {
            this.buffer.splice(start, length);
            return this;
        }

        clear(): this {
            this.buffer = [];
            return this;
        }

        reverse(): this {
            this.buffer.reverse();
            return this;
        }

        toLowerCase(): this {
            this.buffer = this.buffer.map((c) => c.toLowerCase());
            return this;
        }

        toUpperCase(): this {
            this.buffer = this.buffer.map((c) => c.toUpperCase());
            return this;
        }

        get length(): number {
            return this.buffer.length;
        }

        toString(): string {
            return this.buffer.join('');
        }
    }

    function test() {
        const sb = StringBuilder.create('Hello');

        // 下标读写
        console.log(sb[1]); // e
        sb[1] = 'a';
        console.log(sb.toString()); // Hallo

        // substring
        console.log(sb.substring(1, 4)); // all

        // 插入、大小写转换
        sb.insert(5, ' world').toUpperCase();
        console.log(sb.toString()); // HALLO WORLD

        // 查找 & 包含
        console.log(sb.indexOf('WORLD')); // 6
        console.log(sb.includes('HELLO')); // false

        // 删除
        sb.remove(5, 6);
        console.log(sb.toString()); // HALLO
    }
    test();
})();
