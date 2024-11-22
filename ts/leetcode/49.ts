//49. https://leetcode.cn/problems/group-anagrams/
//字母异位词分组

namespace _198 {
    function groupAnagrams(strs: string[]): string[][] {
        let obj: { [key: string]: string[] } = {};
        for (const str of strs) {
            const key = getKey(str);
            if (!(key in obj)) {
                obj[key] = [];
            }
            obj[key].push(str);
        }
        
        return Object.values(obj);
    }

    function getKey(str: string) {
        const arr = Array.from(str).sort((a, b) => {
            return a.charCodeAt(0) - b.charCodeAt(0);
        });
        const key = ''.concat(...arr);
        return key;
    }

    function test(strs: string[]) {
        console.log(groupAnagrams(strs));
    }

    test(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
    test(['']);
    test(['a']);
}
