namespace JSONTest {
    const { parse: $parse, stringify: $stringify } = JSON;
    const { keys } = Object;

    const Primitive = String;   // it could be Number
    const primitive = 'string'; // it could be 'number'

    const ignore = {};
    const object = 'object';

    const noop = (_: any, value: any) => value;

    const primitives = (value: any) => (
        value instanceof Primitive ? Primitive(value) : value
    );

    const Primitives = (_: any, value: any) => (
        typeof value === primitive ? new Primitive(value) : value
    );

    // const revive = (input: any, parsed: any, output: any, $: any) => {
    //     const lazy = [];
    //     for (let ke = keys(output), { length } = ke, y = 0; y < length; y++) {
    //         const k = ke[y];
    //         const value = output[k];
    //         if (value instanceof Primitive) {
    //             const tmp = input[value];
    //             if (typeof tmp === object && !parsed.has(tmp)) {
    //                 parsed.add(tmp);
    //                 output[k] = ignore;
    //                 lazy.push({ k, a: [input, parsed, tmp, $] });
    //             }
    //             else
    //                 output[k] = $.call(output, k, tmp);
    //         }
    //         else if (output[k] !== ignore)
    //             output[k] = $.call(output, k, value);
    //     }
    //     for (let { length } = lazy, i = 0; i < length; i++) {
    //         const { k, a } = lazy[i];
    //         output[k] = $.call(output, k, revive.apply(null, a));
    //     }
    //     return output;
    // };

    const set = (known: any, input: any, value: any) => {
        const index = Primitive(input.push(value) - 1);
        known.set(value, index);
        return index;
    };

    /**
     * Converts a specialized flatted string into a JS value.
     * @param {string} text
     * @param {(this: any, key: string, value: any) => any} [reviver]
     * @returns {any}
     */
    // export const parse = (text: any, reviver: any) => {
    //     const input = $parse(text, Primitives).map(primitives);
    //     const value = input[0];
    //     const $ = reviver || noop;
    //     const tmp = typeof value === object && value ?
    //         revive(input, new Set, value, $) :
    //         value;
    //     return $.call({ '': tmp }, '', tmp);
    // };

    /**
     * Converts a JS value into a specialized flatted string.
     * @param {any} value
     * @param {((this: any, key: string, value: any) => any) | (string | number)[] | null | undefined} [replacer]
     * @param {string | number | undefined} [space]
     * @returns {string}
     */
    // export const stringify = (value: any, replacer: any, space: any) => {
    //     const $ = noop;
    //     const replace = (key: any, value: any) => {
    //         if (firstRun) {
    //             firstRun = !firstRun;
    //             return value;
    //         }
    //         // const after = $.call(this, key, value);
    //         // switch (typeof after) {
    //         //     case object:
    //         //         if (after === null) return after;
    //         //     case primitive:
    //         //         return known.get(after) || set(known, input, after);
    //         // }
    //         // return after;
    //         return ""
    //     }
    //     const known = new Map();
    //     const input: any[] = [];
    //     const output = [];
    //     let i = +set(known, input, $.call({ '': value }, '', value));
    //     let firstRun = !i;
    //     while (i < input.length) {
    //         firstRun = true;
    //         output[i] = $stringify(input[i++], replace, space);
    //     }
    //     return '[' + output.join(',') + ']';


    // };

    /**
     * Converts a generic value into a JSON serializable object without losing recursion.
     * @param {any} value
     * @returns {any}
     */
    // export const toJSON = (value: any) => $parse(stringify(value));

    /**
     * Converts a previously serialized object with recursion into a recursive one.
     * @param {any} value
     * @returns {any}
     */
    // export const fromJSON = (value: any) => parse($stringify(value));

    const obj = {
        a: 10,
        b: 3.14,
        c: 'str1',
        d: function () { console.log('fn') },
        arr: [1, 2, 3, 4],
        obj: {
            a: 123,
            b: 456,
            object: 'str2'
        }
    }

    function test1() {
        let json = JSON.stringify(obj, (key, value) => {
            // console.log('key:' + key, 'value:', value)
            if (typeof value === 'function') {
                return `[function ${value.name}]`
            }
            return value
        })
        // console.log(json);.
        let json2 = JSON.stringify(obj, noop);

        console.log(json2);

    }

    function test2() {
        console.log(noop('', obj));
        console.log(primitives(obj.c));
        console.log(primitives(obj.a));
        console.log(Primitives(obj,obj.c));
        console.log(Primitives(obj,obj.a));
        
    }

    test2();

    function fn() {

    }

}
