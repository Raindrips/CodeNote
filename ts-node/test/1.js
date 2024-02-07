function formatNumber(num) {
    let digits = (num.toString().split('.')[1] || '').length;

    console.log(digits)
}

formatNumber(1)
formatNumber(0)
formatNumber(10)
formatNumber(3.14)