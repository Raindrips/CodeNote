import { LinkedList, ListNode } from "./LinkedList";

export class LRUCache {
    private capacity: number = 0;
    private map: Map<number, ListNode<number, number>> = new Map();
    private list: LinkedList<number, number>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
        this.list = new LinkedList<number, number>();
    }

    get(key: number): number {
        const node = this.map.get(key);
        if (!node) return -1;
        this.list.moveToFront(node);
        return node.value;
    }

    put(key: number, value: number): void {
        const node = this.map.get(key);
        if (node) {
            node.value = value;
            this.list.moveToFront(node);
            return;
        }

        const newNode = new ListNode<number, number>(key, value);
        this.list.addToFront(newNode);
        this.map.set(key, newNode);

        if (this.list.getSize() > this.capacity) {
            const tail = this.list.removeTail();
            if (tail) this.map.delete(tail.key);
        }
    }
}

