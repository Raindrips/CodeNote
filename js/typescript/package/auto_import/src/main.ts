export function MyFn() {
    console.log('MyFn()');
    return 1;
}

export const add = (a: number, b: number): number => {
    return a + b;
};

export const greet = (name: string): string => {
    return `Hello, ${name}!`;
};
