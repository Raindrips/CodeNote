function get<T>(type: { prototype: T }) {
    console.log(type);
}

class ABC {
    id: number = 0;
    name: string = 'hello';
}

function main() {
    get(ABC);
    get(Number);
    get(Date);
}

main();
