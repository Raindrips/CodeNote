class DoubleLinkedListNumber {
    head: DoubleListNode | null = null;
    tail: DoubleListNode | null = null;
    length: number = 0;

    constructor(digits: number[] = []) {
        digits.forEach((d) => this.append(d));
    }

    append(value: number) {
        const node = new DoubleListNode(value);
        if (!this.head) {
            this.head = this.tail = node;
        } else {
            node.prev = this.tail;
            if (this.tail) this.tail.next = node;
            this.tail = node;
        }
        this.length++;
    }

    prepend(value: number) {
        const node = new DoubleListNode(value);
        if (!this.head) {
            this.head = this.tail = node;
        } else {
            node.next = this.head;
            if (this.head) this.head.prev = node;
            this.head = node;
        }
        this.length++;
    }

    toArray(): number[] {
        const arr: number[] = [];
        let curr = this.head;
        while (curr) {
            arr.push(curr.value);
            curr = curr.next;
        }
        return arr;
    }

    toArrayReverse(): number[] {
        const arr: number[] = [];
        let curr = this.tail;
        while (curr) {
            arr.push(curr.value);
            curr = curr.prev;
        }
        return arr;
    }
}

interface Operation {
    execute(
        a: DoubleLinkedListNumber,
        b: DoubleLinkedListNumber,
    ): DoubleLinkedListNumber;
}

class Addition implements Operation {
    execute(
        a: DoubleLinkedListNumber,
        b: DoubleLinkedListNumber,
    ): DoubleLinkedListNumber {
        let pA = a.tail;
        let pB = b.tail;
        let carry = 0;
        const result = new DoubleLinkedListNumber();

        while (pA || pB || carry) {
            const sum = (pA?.value || 0) + (pB?.value || 0) + carry;
            result.prepend(sum % 10);
            carry = Math.floor(sum / 10);
            pA = pA?.prev || null;
            pB = pB?.prev || null;
        }

        return result;
    }
}

class Multiplication implements Operation {
    execute(
        a: DoubleLinkedListNumber,
        b: DoubleLinkedListNumber,
    ): DoubleLinkedListNumber {
        const arrA = a.toArrayReverse(); // 从低位到高位
        const arrB = b.toArrayReverse();
        const result = new Array(arrA.length + arrB.length).fill(0);

        for (let i = 0; i < arrA.length; i++) {
            for (let j = 0; j < arrB.length; j++) {
                result[i + j] += arrA[i] * arrB[j];
                if (result[i + j] >= 10) {
                    result[i + j + 1] += Math.floor(result[i + j] / 10);
                    result[i + j] %= 10;
                }
            }
        }

        while (result.length > 1 && result[result.length - 1] === 0) {
            result.pop();
        }

        return new DoubleLinkedListNumber(result.reverse());
    }
}

class Calculator {
    private operation: Operation;

    constructor(operation: Operation) {
        this.operation = operation;
    }

    setOperation(operation: Operation) {
        this.operation = operation;
    }

    compute(
        a: DoubleLinkedListNumber,
        b: DoubleLinkedListNumber,
    ): DoubleLinkedListNumber {
        return this.operation.execute(a, b);
    }
}

const num1 = new DoubleLinkedListNumber([1, 2, 3]); // 123
const num2 = new DoubleLinkedListNumber([4, 5]); // 45

const calc = new Calculator(new Multiplication());
console.log(calc.compute(num1, num2).toArray().join('')); // 5535

calc.setOperation(new Addition());
console.log(calc.compute(num1, num2).toArray().join('')); // 168
