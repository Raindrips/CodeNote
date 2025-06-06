function answerString(word: string, numFriends: number): string {
    if (numFriends === 1) {
        return word;
    }
    let n = word.length;
    let res = '';
    for (let i = 0; i < n; i++) {
        let m = Math.min(n - numFriends + 1, n - 1);
        let sub = word.substring(i, m);
        res = res > sub ? res : sub;
    }
    return res;
}


