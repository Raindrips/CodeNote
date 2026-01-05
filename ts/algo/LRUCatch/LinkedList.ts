export class ListNode<K,V> {
    key: K;
    value: V;
    prev: ListNode<K,V> | null = null;
    next: ListNode<K,V> | null = null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

export class LinkedList<K,V> {
    private head: ListNode<K,V> | null = null;
    private tail: ListNode<K,V> | null = null;
    private _size: number = 0;

    addToFront(node: ListNode<K,V>): void {
        node.prev = null;
        node.next = this.head;
        if (this.head) this.head.prev = node;
        this.head = node;
        if (!this.tail) this.tail = node;
        this._size++;
    }

    removeNode(node: ListNode<K,V>): void {
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;

        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;

        node.prev = null;
        node.next = null;
        this._size--;
    }

    moveToFront(node: ListNode<K,V>): void {
        if (this.head === node) return;
        this.removeNode(node);
        this.addToFront(node);
    }

    removeTail(): ListNode<K,V> | null {
        if (!this.tail) return null;
        const oldTail = this.tail;
        this.removeNode(oldTail);
        return oldTail;
    }

    getSize(): number {
        return this._size;
    }

    // Expose head for debugging/inspection if needed
    getHead(): ListNode<K,V> | null { return this.head; }
    getTail(): ListNode<K,V> | null { return this.tail; }
}
