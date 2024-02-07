class Vector3 {
    x: number = 0;
    y: number = 0;
    z: number = 0;
}

class Vector2 {
    x: number = 0;
    y: number = 0;
}

class Vector4 {

}

interface Shape { fn(): number; }

class Cube implements Shape { fn(): number { return 0; } }

class Cup { fn(): number { return 0 } }


function identity1<T extends Vector3 | Vector2>(a: T): T {
    return a;
}
function identity2<T extends Shape>(a: T): T { return a; }

function identity3(){
    
}


function main() {
    identity1(new Vector2());
    identity1(new Vector3());
    // identity1(new Vector4());

    identity2(new Cube());
    identity2(new Cup());
}

main();

