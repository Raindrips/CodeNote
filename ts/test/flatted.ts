type Reviver = (this: unknown, key: string, value: unknown) => unknown;
type ReplacerFunction = (
    this: unknown,
    key: string,
    value: unknown,
) => unknown;
type ReplacerArray = (string | number)[];

interface PrimitiveType {
    new (value?: unknown): String;
    (value?: unknown): string;
    prototype: String;
}

const { keys } = Object;

const Primitive: PrimitiveType = String as unknown as PrimitiveType;
const primitiveType = 'string';
const objectType = 'object';
const ignoreValue = {};

const noop: Reviver = (_key, value) => value;

const primitives = (value: unknown): unknown =>
    value instanceof Primitive ? Primitive(value) : value;

const Primitives: Reviver = (_key, value) =>
    typeof value === primitiveType ? new Primitive(value) : value;

function revive(
    input: unknown[],
    parsed: Set<unknown>,
    output: Record<string, unknown>,
    $: Reviver,
): Record<string, unknown> {
    const lazy: Array<{
        k: string;
        a: [unknown[], Set<unknown>, Record<string, unknown>, Reviver];
    }> = [];

    for (const k of keys(output)) {
        const value = output[k];
        if (value instanceof Primitive) {
            const idx = value as any as number;
            const tmp = input[idx];
            if (typeof tmp === objectType && !parsed.has(tmp)) {
                parsed.add(tmp);
                output[k] = ignoreValue;
                lazy.push({
                    k,
                    a: [input, parsed, tmp as Record<string, unknown>, $],
                });
            } else {
                output[k] = $.call(output, k, tmp);
            }
        } else if (output[k] !== ignoreValue) {
            output[k] = $.call(output, k, value);
        }
    }

    for (const { k, a } of lazy) {
        output[k] = $.call(output, k, revive(...a));
    }

    return output;
}

function set(
    known: Map<unknown, unknown>,
    input: unknown[],
    value: unknown,
): unknown {
    const idx = Primitive(input.push(value) - 1);
    known.set(value, idx);
    return idx;
}

function parse(text: string, reviver?: Reviver): unknown {
    const input = JSON.parse(text, Primitives).map(primitives);
    const value = input[0];
    const $ = reviver ?? noop;
    const tmp =
        typeof value === objectType && value !== null
            ? revive(input, new Set(), value as Record<string, unknown>, $)
            : value;
    return $.call({ '': tmp }, '', tmp);
}

function stringify(
    value: unknown,
    replacer?: ReplacerFunction | ReplacerArray | null,
    space?: string | number,
): string {
    const $ =
        replacer && typeof replacer === objectType
            ? (k: string, v: unknown): unknown =>
                  k === '' || (replacer as ReplacerArray).indexOf(k) > -1
                      ? v
                      : undefined
            : (replacer as ReplacerFunction) ?? noop;

    const known = new Map<unknown, unknown>();
    const input: unknown[] = [];
    const output: string[] = [];
    let i = set(known, input, $.call({ '': value }, '', value)) as number;
    if (typeof i != 'number') {
        i = 0;
    }
    let firstRun = i === 0;

    while (i < input.length) {
        firstRun = true;
        output[i] = JSON.stringify(input[i++], replace, space);
    }

    return `[${output.join(',')}]`;

    function replace(key: string, value: unknown): unknown {
        if (firstRun) {
            firstRun = false;
            return value;
        }
        //@ts-ignore
        const after = $.call(this, key, value);
        switch (typeof after) {
            case objectType:
                if (after === null) {
                    return after;
                }
            // fallthrough
            case primitiveType:
                return known.get(after) ?? set(known, input, after);
        }
        return after;
    }
}

function toJSON(value: unknown): unknown {
    return JSON.parse(stringify(value));
}

function fromJSON(value: unknown): unknown {
    return parse(JSON.stringify(value));
}

// TEST
class A {
    a = 0;
    b = '';
    next: A | null = null;
}

const a1 = new A();
const a2 = new A();

a1.a = 1;
a1.b = 'hello';
a1.next = a2;

a2.a = 2;
a2.b = 'world';
a2.next = a1;

console.log('a1', a1, 'a2', a2);

console.log(a1.next == a2, a2.next == a1);

let root = { a1, a2 };
const s1 = stringify(root);

console.log(s1);

const obj = parse(s1) as { a1: A; a2: A };

const { a1: obj1, a2: obj2 } = obj;

console.log('o1', obj1.next, 'o2', obj2.next);

console.log(obj1.next == obj2, obj2.next == obj1);
