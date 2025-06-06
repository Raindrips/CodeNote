(() => {
    class BrowserHistory {
        history: string[] = [];
        blackIndex = 0;
        constructor(homepage: string) {
            this.history.push(homepage);
            this.blackIndex = 0;
        }

        visit(url: string): void {
            if (this.blackIndex != this.history.length - 1) {
                this.history.splice(this.blackIndex + 1);
            }
            this.history.push(url);
            this.blackIndex = this.history.length - 1;
        }

        back(steps: number): string {
            this.blackIndex = Math.max(this.blackIndex - steps, 0);

            return this.history[this.blackIndex];
        }

        forward(steps: number): string {
            this.blackIndex = Math.min(
                this.blackIndex + steps,
                this.history.length - 1,
            );
            return this.history[this.blackIndex];
        }
    }

    /**
     * Your BrowserHistory object will be instantiated and called as such:
     * var obj = new BrowserHistory(homepage)
     * obj.visit(url)
     * var param_2 = obj.back(steps)
     * var param_3 = obj.forward(steps)
     */

    function factory(cmd: string[], value: (string | number)[]) {
        let obj = new BrowserHistory('123');
        for (let i = 0; i < cmd.length; i++) {
            const c = cmd[i];
            const v = value[i];
            switch (c) {
                case 'BrowserHistory':
                    console.log('null');
                    break;
                case 'visit':
                    console.log(obj.visit(String(v)));
                    console.log(obj.history, obj.blackIndex);
                    break;
                case 'back':
                    console.log(obj.back(Number(v)));
                    console.log(obj.history, obj.blackIndex);
                    break;
                case 'forward':
                    console.log(obj.forward(Number(v)));
                    console.log(obj.history, obj.blackIndex);
                    break;
            }
        }
    }

    function test() {
        var obj = new BrowserHistory('123');
        obj.visit('abc');
        obj.visit('456');
        obj.visit('789');
        let param_2 = obj.back(1);
        let param_3 = obj.forward(1);

        console.log(param_2, param_3);
    }

    function test2(cmd: string[], value: (string | number)[]) {
        factory(cmd, value);
    }
    test2(
        [
            'BrowserHistory',
            'visit',
            'visit',
            'visit',
            'back',
            'back',
            'forward',
            'visit',
            'forward',
            'back',
            'back',
        ],
        [
            'leetcode.com',
            'google.com',
            'facebook.com',
            'youtube.com',
            1,
            1,
            1,
            'linkedin.com',
            2,
            2,
            7,
        ],
    );
})();
