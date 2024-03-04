

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


function main() {
    let data = new Data();
    data.send();
}

main();