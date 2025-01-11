
function romanToInt(s: string): number {
    const charMap1 = ['I', 'X', 'C', 'M'];
    const charMap5 = ['V', 'L', 'D'];
    let arr = splitNumber(s);
    let char_1, char_5;
    let res="";
    for (let i = 0; i < arr.length; i++) {

    }
    return 0;
};

function splitNumber(num: number): number[] {
    return num.toString().split('').map(Number);
}

