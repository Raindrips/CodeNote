// 翻转字符串里的单词
namespace array_2 {
    function reverseWords(s: string): string {
        let arr = s.trim().split(/ +/g).reverse();
        const result = arr.join(' ');
        return result;
    }

    function test(s: string) {
        console.log(reverseWords(s));
    }

    test('  the sky  is blue  ');
    test('  hello   world  ');
    test(' a good   example');
    
}
