
function get<T>(type: { prototype: T }, value: T) {
    console.log(type);
    console.log(value);
}

class ABC{
    id:number=0;
    name:string='hello'
}

function main(){
    console.log(ABC)
    get(ABC, new ABC())
}

main();
