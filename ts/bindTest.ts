

class Data {
    a: number = 0

    send() {
        Call(this.end.bind(this, 'MyKey'));
    }

    end(key: string, data: string) {
        console.log(`${data} + ${this.a} +${key}`);
    }
}

function Call(fn: Function) {
    console.log(fn)
    fn('call data');
}

function getThis(this: unknown): unknown {
    return this;
}


function main() {
   let obj={a:1,b:'hello'};
   let fn=getThis.bind(obj);
   let data=fn();
   console.log(data)

}

function myFunction(this:unknown){
    console.log(this);
}

let fn:Function|null=null;
let obj={a:1,b:'hello'};


fn=myFunction.bind(obj);
fn();