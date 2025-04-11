(function () {

    function test1() {
        //3秒后返回一个string
        const myPromise = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve("return val");
            }, 3000);
        });

        myPromise.then((val: string) => { console.log(val) })

    }

    function test2() {
        const myPromise = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve("return val");
            }, 3000);
        });
        let v = async () => {
            let val = await myPromise;
            console.log(val)
        }
        v();
    }

    async function test3() {
        let myPromise = async () => {
            setTimeout(() => {
                return "return val";
            }, 3000);
        }

        let v = await myPromise()
        console.log(v);
    }

    async function myPromise() {
        return 'value1';
    }

    function myPromise2() {
        return new Promise<string>((resolve, reject) => {
            resolve('value2')
        });
    }


    async function test4() {
        let v1 = await myPromise();
        let v2 = await myPromise2();

        console.log('v1=', v1)
        console.log('v2=', v2)
    }

    function test5() {
        let v1 = ''
        let v2 = ''
        myPromise()
            .then(val => { v1 = val; return myPromise2() })
            .then(val => { v2 = val })

    }

    test5();
})()

