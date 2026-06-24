import { LRUCache } from "./LRUCache";

function runExample() {
    const cache = new LRUCache(2);
    console.log(cache.get(1)); // -1
    cache.put(1, 1);
    cache.put(2, 2);
    console.log(cache.get(1)); // 1
    cache.put(3, 3); // evicts key 2
    console.log(cache.get(2)); // -1
    cache.put(4, 4); // evicts key 1
    console.log(cache.get(1)); // -1
    console.log(cache.get(3)); // 3
    console.log(cache.get(4)); // 4
}

runExample();
