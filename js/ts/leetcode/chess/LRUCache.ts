class MyListNode {
    key: number;
    value: number;
    prev: MyListNode | null = null;
    next: MyListNode | null = null;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }
}

class MyLinkedList {
    private head: MyListNode| null = null;
    private tail: MyListNode | null = null;
    private _size: number = 0;

    addToFront(node: MyListNode): void {
        node.prev = null;
        node.next = this.head;
        if (this.head) this.head.prev = node;
        this.head = node;
        if (!this.tail) this.tail = node;
        this._size++;
    }

    removeNode(node: MyListNode): void {
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;

        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;

        node.prev = null;
        node.next = null;
        this._size--;
    }

    moveToFront(node: MyListNode): void {
        if (this.head === node) return;
        this.removeNode(node);
        this.addToFront(node);
    }

    removeTail(): MyListNode | null {
        if (!this.tail) return null;
        const oldTail = this.tail;
        this.removeNode(oldTail);
        return oldTail;
    }

    getSize(): number {
        return this._size;
    }
}

class LRUCache {
    private capacity: number = 0;
    private map: Map<number, MyListNode> = new Map();
    private list: MyLinkedList;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
        this.list = new MyLinkedList();
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

        const newNode = new MyListNode(key, value);
        this.list.addToFront(newNode);
        this.map.set(key, newNode);

        if (this.list.getSize() > this.capacity) {
            const tail = this.list.removeTail();
            if (tail) this.map.delete(tail.key);
        }
    }
}

