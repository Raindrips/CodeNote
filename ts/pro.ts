import { AsyncQueue } from "./AsyncQueue";

function Open() {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("open");
            resolve();
        }, 1000);
    });
}

function Close() {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("close");
            resolve();
        }, 200);
    });
}

let open: Promise<void> | null = null;
function main1() {
    open = Open();

    // await open;
    // await close;
}

function main2() {
    let fn = async () => {
        if (open) {
            await open;
        }
        await Close();
    };
    fn();
}

function test1() {
    let que = new AsyncQueue();
    que.push(Open, Close);

    que.play();
}

async function test2() {
    let a = await new Promise<number>((r) => {
        console.log('1...')
        setTimeout(() => {
            r(1);
        }, 1000)
    })
    let b = await new Promise<number>((r) => {
        console.log('2...')
        setTimeout(() => {
            r(2);
        }, 1000)
    })
    let c = await new Promise<number>((r) => {
        console.log('3...')
        setTimeout(() => {
            r(3);
        }, 1000)
    })
    console.log(a, b, c);
}
// test2();

function test() {
    new Promise<number>((r) => {
        console.log('1...')
        setTimeout(() => {
            r(1);
        }, 1000)
    }).then((a) => {
        return new Promise<number>((r) => {
            console.log('2...')
            setTimeout(() => {
                r(2);
            }, 1000)
        }).then((b) => {
            return new Promise<number>((r) => {
                console.log('3...')
                setTimeout(() => {
                    r(3);
                }, 1000)
            }).then((c) => {
                console.log(a, b, c);
            });
        });
    });
}

test();

// main1();
// main2();
