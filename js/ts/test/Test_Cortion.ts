{
    function* getData(obj: any) {
        console.log(obj);
        yield null;
        console.log(obj);
        yield null;
        console.log(obj);
        yield null;
        console.log(obj);
        yield null;
        console.log(obj);
        yield null;
    }

    const obj = { a: 0 };
    for (let d of getData(obj)) {
        obj.a++;
    }
}