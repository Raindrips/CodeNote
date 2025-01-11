namespace PromiseLog {
    async function test1() {
        let a = await Promise.resolve(1)
            .then((res) => {
                return res + 1;
            })
            .then((b) => {
                console.log(b);
            });
    }

    function test2() {
        const p = new Promise<number>((res, reject) => {
            setTimeout(() => {
                res(1);
            }, 4000);
        });

        const p2 = new Promise<number>((res, reject) => {
            setTimeout(() => {
                res(2);
            }, 1000);
        });

        Promise.race([p, p2]).then((val) => {
            console.log('end', val);
        });
    }

    function test3() {
        new Promise<number>((res, reject) => {
            setTimeout(() => {
                console.log('return');
                res(1);
            }, 1000);
        }).then((val) => {
            return new Promise<number>((res, reject) => {
                setTimeout(() => {
                    console.log('return', val);
                    res(val + val);
                }, 1000);
            });
        })
        .then((val) => {
            return new Promise<number>((res, reject) => {
                setTimeout(() => {
                    console.log('return', val);
                    res(val + val);
                }, 1000);
            });
        })
    }

    test3();
}
