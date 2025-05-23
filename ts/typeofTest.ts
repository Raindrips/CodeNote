{
    class MyData {
        a: number = 1;
        b: string = 'key';
        c: Object = { id: 2, n: 'name' };
        fn = () => {
            console.log(this.a);
            console.log('fn');
        };
        ref: Function | null = null;
        other: MyData | null = null;

        constructor() {
            console.log(typeof this.a);
            console.log(typeof this.b);
            console.log(typeof this.c);
            console.log(typeof this.fn);
            console.log(typeof this.ref);
            console.log(typeof this.other);
        }
    }

    const d = new MyData();
    const d2 = new MyData();
    d.other = d2;

    d.ref = function () {
        console.log('other fn');
    };
    d2.other = d;

    // let s = JSON.stringify(d);
    // console.log(s);
    // console.log(d);

    enum E {
        number,
        string,
    }
    let str = new String('world');
    let str2 = str;
    str2 = 'hello';
    console.log(E.number);

    let b = 'set'.substring(1, 3);

    console.log(b);
    console.log(parseInt("1101",2));
}
