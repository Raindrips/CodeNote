(function () {
    function findSubstring(s: string, words: string[]): number[] {
        let wordLength = words[0].length;
        let totalWordsLength = wordLength * words.length;
        let wordCount: { [key: string]: number } = {};
        let result: number[] = [];

        //遍历字串字典
        for (let word of words) {
            if (word in wordCount) {
                wordCount[word]++;
            } else {
                wordCount[word] = 1;
            }
        }

        for (let i = 0; i <= s.length - totalWordsLength; i++) {
            let seenWords: { [key: string]: number } = {};
            let j = 0;

            while (j < words.length) {
                let wordIndex = i + j * wordLength;
                let word = s.substring(wordIndex, wordIndex + wordLength);

                if (!(word in wordCount)) {
                    break; // Not a valid word
                }

                if (word in seenWords) {
                    seenWords[word]++;
                } else {
                    seenWords[word] = 1;
                }

                if (seenWords[word] > wordCount[word]) {
                    break;
                }
                j++;
            }

            if (j === words.length) {
                result.push(i);
            }
        }

        return result;
    }

    function test(s: string, words: string[]) {
        console.log(findSubstring(s, words));
    }

    test('barfoothefoobarman', ['foo', 'bar']);
    test('wordgoodgoodgoodbestword', ['word', 'good', 'best', 'word']);
    test('barfoofoobarthefoobarman', ['bar', 'foo', 'the']);

})();
