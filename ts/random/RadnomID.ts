{
    class RandomNumberGenerator {
        private cache: Map<string, number>;
        private idQueue: string[];
        private capacity: number;
      
        constructor(capacity: number = 10) {
          this.cache = new Map();
          this.idQueue = [];
          this.capacity = capacity;
        }
      
        /**
         * 获取指定 id 的随机数。如果 id 不存在，则生成一个新的随机数。
         * 如果缓存已满，则按照队列的方式释放最旧的 id。
         * @param id 要获取随机数的 id
         * @returns 该 id 对应的随机数
         */
        getRandomNumber(id: string): number {
          if (this.cache.has(id)) {
            return this.cache.get(id)!;
          } else {
            const randomNumber = Math.random();
            this.cache.set(id, randomNumber);
            this.idQueue.push(id);
      
            if (this.idQueue.length > this.capacity) {
              const oldestId = this.idQueue.shift();
              if (oldestId) {
                this.cache.delete(oldestId);
              }
            }
            return randomNumber;
          }
        }
      
        /**
         * 获取当前缓存中存储的 id 数量。
         * @returns 缓存中 id 的数量
         */
        getCacheSize(): number {
          return this.cache.size;
        }
      
        /**
         * 获取当前队列中存储的 id 数量。
         * @returns 队列中 id 的数量
         */
        getQueueSize(): number {
          return this.idQueue.length;
        }
      
        /**
         * 清空缓存和队列。
         */
        clearCache(): void {
          this.cache.clear();
          this.idQueue = [];
        }
      }
      
      // 示例用法
      const generator = new RandomNumberGenerator(5);
      
      console.log("获取 id 'a':", generator.getRandomNumber('a'));
      console.log("获取 id 'b':", generator.getRandomNumber('b'));
      console.log("获取 id 'a' (再次获取):", generator.getRandomNumber('a')); // 应从缓存中获取
      console.log("缓存大小:", generator.getCacheSize());
      console.log("队列大小:", generator.getQueueSize());
      
      console.log("获取 id 'c':", generator.getRandomNumber('c'));
      console.log("获取 id 'd':", generator.getRandomNumber('d'));
      console.log("获取 id 'e':", generator.getRandomNumber('e'));
      console.log("缓存大小:", generator.getCacheSize());
      console.log("队列大小:", generator.getQueueSize());
      
      console.log("获取 id 'f' (超出容量):", generator.getRandomNumber('f'));
      console.log("缓存大小:", generator.getCacheSize()); // 应该仍然是 5
      console.log("队列大小:", generator.getQueueSize()); // 仍然是 5
      
      console.log("获取 id 'a' (已被移除):", generator.getRandomNumber('a')); // 会生成新的随机数
      
      generator.clearCache();
      console.log("缓存已清空, 大小:", generator.getCacheSize());
      console.log("队列已清空, 大小:", generator.getQueueSize());
}