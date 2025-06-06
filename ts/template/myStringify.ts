(() => {
    {
        function myStringify(
            value: any,
            replacer?: (key: string, value: any) => any,
            space?: number,
        ): string {
            // Helper function to handle formatting spaces
            function getIndent(level: number): string {
                return space ? ' '.repeat(level * space) : '';
            }

            function serialize(
                key: string,
                value: any,
                level: number,
            ): string {
                if (replacer) {
                    value = replacer(key, value);
                }

                if (value === null) {
                    return 'null';
                }

                if (
                    typeof value === 'boolean' ||
                    typeof value === 'number'
                ) {
                    return String(value);
                }

                if (typeof value === 'string') {
                    return `"${value}"`;
                }

                if (Array.isArray(value)) {
                    const arrayContent = value.map((item, index) =>
                        serialize(index.toString(), item, level + 1),
                    );
                    return `[${
                        space ? '\n' + getIndent(level + 1) : ''
                    }${arrayContent.join(
                        space ? ',\n' + getIndent(level + 1) : ',',
                    )}${space ? '\n' + getIndent(level) : ''}]`;
                }

                if (typeof value === 'object') {
                    const objectContent = Object.keys(value)
                        .map((key) => {
                            const serializedValue = serialize(
                                key,
                                value[key],
                                level + 1,
                            );
                            return serializedValue !== undefined
                                ? `"${key}":${
                                      space ? ' ' : ''
                                  }${serializedValue}`
                                : undefined;
                        })
                        .filter((item) => item !== undefined);
                    return `{${
                        space ? '\n' + getIndent(level + 1) : ''
                    }${objectContent.join(
                        space ? ',\n' + getIndent(level + 1) : ',',
                    )}${space ? '\n' + getIndent(level) : ''}}`;
                }
                return '';
            }

            return serialize('', value, 0);
        }

        // 示例用法
        const person = {
            name: 'John Doe',
            age: 30,
            password: 'secret',
            address: {
                city: 'New York',
                zipcode: '10001',
            },
            hobbies: ['reading', 'travelling'],
        };

        // 自定义 replacer 函数
        function replacer(key: string, value: any) {
            if (key === 'password') {
                return '******';
            }
            return value;
        }

        const jsonString = myStringify(person, replacer, 1);
        console.log(jsonString);
    }
})();
