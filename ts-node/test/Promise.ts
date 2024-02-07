namespace TEST {
    async function fn1() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('fn1')
                resolve(0)
            }, 1000)
        });
    }

    async function fn2() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('fn2')
                resolve(0)
            }, 1000)
        });
    }

    async function fn3() {
        console.log('fn3')
        setTimeout(() => { }, 1000)
    }

    async function fn4() {
        console.log('fn4')
        setTimeout(() => { }, 1000)
    }

    function test1() {
        const myPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("foo");
            }, 500);
        });
        myPromise.then(fn1)
    }

    async function test2() {
        console.log('start')
        await fn1();
        await fn2();
        await new Promise((f) => setTimeout(f, 1000))
        console.log('end')
    }

    async function test3() {
        console.log('start--2')
        await fn1();
        await fn2();
        await new Promise((f) => setTimeout(f, 1000))
        console.log('end--2')
    }

    async function test4() {
        console.log('start--3')
        await new Promise((f) => setTimeout(f, 5000))
        console.log('end--3')

    }

    async function test5() {
        await test2();
        await test3();
        await test4();
    }

    function test6() {
        return new Promise<void>((resolve, reject) => {
            test2()
                .then(test3)
                .then(test4);
            resolve()
        })
    }

    try {
        test6();
    }
    catch (e) {
        console.log(e)
    }
}