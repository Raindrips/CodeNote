function get<T>(type: { prototype: T }) {
    console.log(type);
}

class ABC {
    id: number = 0;
    name: string = 'hello';
}

function main() {
    console.log(ABC);
    get(ABC);
}

main();
