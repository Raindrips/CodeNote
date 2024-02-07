function formatToNumber(str: string) {
    str = str.replace(/,/g, '')
    return str;
}

function main() {
    var a=formatToNumber('123,123')
    var b=formatToNumber('123,123,456')
    var c=formatToNumber('123,123.001')

    console.log(parseFloat(a));
    console.log(parseFloat(b));
    console.log(parseFloat(c));
}

main()