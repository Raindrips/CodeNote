(() => {
    let arr = [];
    arr.length = 100;
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.trunc(Math.sin(i) * 100);
    }
    console.log(arr);
})();
