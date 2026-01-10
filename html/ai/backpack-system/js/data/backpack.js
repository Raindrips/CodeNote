/**
 * 背包数据模块
 * 定义背包的基础数据结构和管理逻辑
 */

/**
 * 背包配置常量
 */
export const BackpackConfig = {
    DEFAULT_SIZE: 20,           // 默认背包格子数量
    MAX_SIZE: 100,              // 最大背包格子数量
    EXPANSION_COST: 1000,       // 扩展背包所需金币
    EXPANSION_INCREMENT: 10     // 每次扩展增加的格子数量
};

/**
 * 背包排序方式枚举
 */
export const SortType = {
    DEFAULT: 'default',         // 默认排序（按添加顺序）
    NAME: 'name',               // 按名称排序
    TYPE: 'type',               // 按类型排序
    QUANTITY: 'quantity',       // 按数量排序
    RARITY: 'rarity'            // 按稀有度排序
};

/**
 * 背包格子类
 */
export class Slot {
    constructor(index) {
        this.index = index;      // 格子索引
        this.item = null;        // 格子中的物品实例
        this.locked = false;   // 是否锁定（未解锁的格子）
    }

    /**
     * 判断格子是否为空
     */
    isEmpty() {
        return this.item === null;
    }

    /**
     * 判断格子是否被锁定
     */
    isLocked() {
        return this.locked;
    }

    /**
     * 获取格子中的物品
     */
    getItem() {
        return this.item;
    }

    /**
     * 设置物品
     */
    setItem(itemInstance) {
        this.item = itemInstance;
        if (itemInstance) {
            itemInstance.position = this.index;
        }
    }

    /**
     * 清空格子
     */
    clear() {
        this.item = null;
    }

    /**
     * 锁定格子
     */
    lock() {
        this.locked = true;
    }

    /**
     * 解锁格子
     */
    unlock() {
        this.locked = false;
    }
}

/**
 * 背包类
 */
export class Backpack {
    constructor(size = BackpackConfig.DEFAULT_SIZE) {
        this.size = size;                    // 背包总大小
        this.slots = [];                     // 背包格子数组
        this.gold = 0;                       // 金币数量
        this.maxStackSize = 999;            // 最大堆叠数量
        
        this.initSlots();
    }

    /**
     * 初始化背包格子
     */
    initSlots() {
        this.slots = [];
        for (let i = 0; i < this.size; i++) {
            this.slots.push(new Slot(i));
        }
    }

    /**
     * 获取指定位置的格子
     */
    getSlot(index) {
        if (index < 0 || index >= this.size) {
            return null;
        }
        return this.slots[index];
    }

    /**
     * 获取所有已使用的格子
     */
    getUsedSlots() {
        return this.slots.filter(slot => !slot.isEmpty());
    }

    /**
     * 获取所有空格子
     */
    getEmptySlots() {
        return this.slots.filter(slot => slot.isEmpty() && !slot.isLocked());
    }

    /**
     * 获取第一个空格子
     */
    getFirstEmptySlot() {
        return this.slots.find(slot => slot.isEmpty() && !slot.isLocked());
    }

    /**
     * 判断背包是否已满
     */
    isFull() {
        return this.getEmptySlots().length === 0;
    }

    /**
     * 扩展背包大小
     */
    expand(increment = BackpackConfig.EXPANSION_INCREMENT) {
        const oldSize = this.size;
        const newSize = Math.min(this.size + increment, BackpackConfig.MAX_SIZE);
        
        if (newSize > this.size) {
            this.size = newSize;
            
            // 添加新的格子
            for (let i = oldSize; i < newSize; i++) {
                this.slots.push(new Slot(i));
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * 获取物品总数
     */
    getTotalItemCount() {
        return this.getUsedSlots().reduce((total, slot) => {
            return total + (slot.getItem()?.quantity || 0);
        }, 0);
    }

    /**
     * 获取不同类型的物品数量
     */
    getItemCountByType() {
        const counts = {};
        this.getUsedSlots().forEach(slot => {
            const item = slot.getItem()?.item;
            if (item) {
                counts[item.type] = (counts[item.type] || 0) + slot.getItem().quantity;
            }
        });
        return counts;
    }

    /**
     * 序列化背包数据（用于保存）
     */
    serialize() {
        const data = {
            size: this.size,
            gold: this.gold,
            slots: this.slots.map(slot => ({
                index: slot.index,
                locked: slot.locked,
                item: slot.item ? {
                    itemId: slot.item.item.id,
                    quantity: slot.item.quantity
                } : null
            }))
        };
        return JSON.stringify(data);
    }

    /**
     * 反序列化背包数据（用于加载）
     */
    deserialize(dataStr, itemDatabase) {
        try {
            const data = JSON.parse(dataStr);
            this.size = data.size || BackpackConfig.DEFAULT_SIZE;
            this.gold = data.gold || 0;
            
            this.initSlots();
            
            // 恢复物品数据
            if (data.slots) {
                data.slots.forEach(slotData => {
                    const slot = this.getSlot(slotData.index);
                    if (slot) {
                        slot.locked = slotData.locked || false;
                        
                        if (slotData.item) {
                            const item = itemDatabase.getItem(slotData.item.itemId);
                            if (item) {
                                const ItemInstance = window.ItemInstance || class {
                                    constructor(item, quantity) {
                                        this.item = item;
                                        this.quantity = quantity;
                                        this.position = null;
                                    }
                                };
                                const itemInstance = new ItemInstance(item, slotData.item.quantity);
                                slot.setItem(itemInstance);
                            }
                        }
                    }
                });
            }
            
            return true;
        } catch (error) {
            console.error('反序列化背包数据失败:', error);
            return false;
        }
    }
}