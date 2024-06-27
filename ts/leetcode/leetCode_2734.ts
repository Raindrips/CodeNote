function smallestString(s: string): string {
    let map = ''
    for (let c = 'a'.codePointAt(0)!; c <= 'z'.codePointAt(0)!; c++) {
        map += String.fromCharCode(c);
    }
    console.log(map);
    return map
};

function getPrevChar(c: string) {
    let code: number = c.codePointAt(0)!;
    return String.fromCodePoint(code - 1);
}


smallestString('');