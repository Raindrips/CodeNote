/**
 * 背包逻辑模块
 * 处理背包相关的业务逻辑
 */

import { BackpackConfig, SortType } from '../data/backpack.js';
import { ItemLogic } from './itemLogic.js';

/**
 * 背包逻辑管理器
 */
export class BackpackLogic {
    constructor(backpack, itemDatabase) {
        this.backpack = backpack;
        this.itemDatabase = itemDatabase;
        this.itemLogic = new ItemLogic();
        this.sortType = SortType.DEFAULT;
    }

    /**
     * 添加物品到背包
     */
    addItem(itemId, quantity = 1) {
        const item = this.itemDatabase.getItem(itemId);
        if (!item) {
            return { success: false, message: '物品不存在' };
        }

        // 检查是否可以堆叠
        if (item.maxStack > 1) {
            const existingSlots = this.findItemSlots(itemId);
            let remainingQuantity = quantity;

            // 先填充现有的堆叠
            for (const slot of existingSlots) {
                const slotItem = slot.getItem();
                const canAdd = item.maxStack - slotItem.quantity;
                
                if (canAdd > 0) {
                    const addQuantity = Math.min(canAdd, remainingQuantity);
                    slotItem.quantity += addQuantity;
                    remainingQuantity -= addQuantity;
                    
                    if (remainingQuantity <= 0) {
                        return { success: true, message: `成功添加 ${quantity} 个 ${item.name}` };
                    }
                }
            }

            // 如果还有剩余，寻找新的空格子
            if (remainingQuantity > 0) {
                return this.addItemToNewSlot(item, remainingQuantity);
            }
        } else {
            // 不可堆叠的物品
            return this.addItemToNewSlot(item, quantity);
        }

        return { success: false, message: '背包已满' };
    }

    /**
     * 将物品添加到新格子
     */
    addItemToNewSlot(item, quantity) {
        const emptySlot = this.backpack.getFirstEmptySlot();
        if (!emptySlot) {
            return { success: false, message: '背包已满' };
        }

        // 创建物品实例
        const ItemInstance = window.ItemInstance || class {
            constructor(item, quantity) {
                this.item = item;
                this.quantity = quantity;
                this.position = null;
            }
        };
        
        const itemInstance = new ItemInstance(item, quantity);
        emptySlot.setItem(itemInstance);

        return { success: true, message: `成功添加 ${quantity} 个 ${item.name}` };
    }

    /**
     * 移除物品
     */
    removeItem(slotIndex, quantity = 1) {
        const slot = this.backpack.getSlot(slotIndex);
        if (!slot || slot.isEmpty()) {
            return { success: false, message: '该格子没有物品' };
        }

        const itemInstance = slot.getItem();
        if (itemInstance.quantity < quantity) {
            return { success: false, message: '物品数量不足' };
        }

        itemInstance.quantity -= quantity;
        
        if (itemInstance.quantity <= 0) {
            slot.clear();
        }

        return { 
            success: true, 
            message: `移除了 ${quantity} 个 ${itemInstance.item.name}` 
        };
    }

    /**
     * 移动物品
     */
    moveItem(fromSlotIndex, toSlotIndex) {
        const fromSlot = this.backpack.getSlot(fromSlotIndex);
        const toSlot = this.backpack.getSlot(toSlotIndex);

        if (!fromSlot || !toSlot) {
            return { success: false, message: '无效的格子位置' };
        }

        if (fromSlot.isEmpty()) {
            return { success: false, message: '源格子没有物品' };
        }

        if (fromSlotIndex === toSlotIndex) {
            return { success: false, message: '不能移动到相同位置' };
        }

        const fromItem = fromSlot.getItem();
        const toItem = toSlot.getItem();

        // 如果目标格子为空，直接移动
        if (toSlot.isEmpty()) {
            toSlot.setItem(fromItem);
            fromSlot.clear();
            return { success: true, message: '移动成功' };
        }

        // 如果目标格子有物品，检查是否可以堆叠
        if (this.itemLogic.canStack(fromItem, toItem)) {
            const originalQuantity = fromItem.quantity;
            const merged = this.itemLogic.mergeStacks(toItem, fromItem);
            
            if (fromItem.quantity <= 0) {
                fromSlot.clear();
                return { success: true, message: '堆叠成功' };
            } else {
                return { success: true, message: `部分堆叠：移动了 ${originalQuantity - fromItem.quantity} 个物品` };
            }
        }

        // 交换物品位置
        toSlot.setItem(fromItem);
        fromSlot.setItem(toItem);

        return { success: true, message: '交换成功' };
    }

    /**
     * 使用物品
     */
    useItem(slotIndex) {
        const slot = this.backpack.getSlot(slotIndex);
        if (!slot || slot.isEmpty()) {
            return { success: false, message: '该格子没有物品' };
        }

        const result = this.itemLogic.useItem(slot.getItem());
        
        if (result.success && result.consumed) {
            slot.clear();
        }

        return result;
    }

    /**
     * 丢弃物品
     */
    dropItem(slotIndex, quantity = 1) {
        const slot = this.backpack.getSlot(slotIndex);
        if (!slot || slot.isEmpty()) {
            return { success: false, message: '该格子没有物品' };
        }

        const result = this.itemLogic.dropItem(slot.getItem(), quantity);
        
        if (result.success) {
            const itemInstance = slot.getItem();
            if (itemInstance.quantity <= 0) {
                slot.clear();
            }
        }

        return result;
    }

    /**
     * 查找物品所在的格子
     */
    findItemSlots(itemId) {
        return this.backpack.getUsedSlots().filter(slot => 
            slot.getItem().item.id === itemId
        );
    }

    /**
     * 获取物品总数
     */
    getItemCount(itemId) {
        const slots = this.findItemSlots(itemId);
        return slots.reduce((total, slot) => {
            return total + slot.getItem().quantity;
        }, 0);
    }

    /**
     * 检查是否有足够的物品
     */
    hasItem(itemId, quantity = 1) {
        return this.getItemCount(itemId) >= quantity;
    }

    /**
     * 排序背包
     */
    sortBackpack(sortType = SortType.DEFAULT) {
        this.sortType = sortType;
        
        // 获取所有物品
        const items = [];
        this.backpack.slots.forEach(slot => {
            if (!slot.isEmpty()) {
                items.push({
                    slot: slot.index,
                    item: slot.getItem()
                });
            }
        });

        // 排序
        items.sort((a, b) => {
            switch (sortType) {
                case SortType.NAME:
                    return a.item.item.name.localeCompare(b.item.item.name);
                
                case SortType.TYPE:
                    return a.item.item.type.localeCompare(b.item.item.type);
                
                case SortType.QUANTITY:
                    return b.item.quantity - a.item.quantity;
                
                case SortType.RARITY:
                    return b.item.item.rarity.level - a.item.item.rarity.level;
                
                default:
                    return a.slot - b.slot;
            }
        });

        // 清空背包
        this.backpack.slots.forEach(slot => slot.clear());

        // 重新放置物品
        items.forEach((itemData, index) => {
            this.backpack.slots[index].setItem(itemData.item);
        });

        return { success: true, message: '排序完成' };
    }

    /**
     * 扩展背包
     */
    expandBackpack() {
        if (this.backpack.gold < BackpackConfig.EXPANSION_COST) {
            return { success: false, message: '金币不足' };
        }

        if (this.backpack.size >= BackpackConfig.MAX_SIZE) {
            return { success: false, message: '背包已达到最大容量' };
        }

        const success = this.backpack.expand();
        if (success) {
            this.backpack.gold -= BackpackConfig.EXPANSION_COST;
            return { 
                success: true, 
                message: `背包扩展成功，容量增加到 ${this.backpack.size} 格` 
            };
        }

        return { success: false, message: '扩展失败' };
    }

    /**
     * 获取背包统计信息
     */
    getBackpackStats() {
        const usedSlots = this.backpack.getUsedSlots().length;
        const totalSlots = this.backpack.size;
        const totalItems = this.backpack.getTotalItemCount();
        const itemCountsByType = this.backpack.getItemCountByType();

        return {
            usedSlots,
            totalSlots,
            emptySlots: totalSlots - usedSlots,
            totalItems,
            gold: this.backpack.gold,
            itemCountsByType,
            usageRate: Math.round((usedSlots / totalSlots) * 100)
        };
    }

    /**
     * 保存背包数据
     */
    saveBackpack() {
        try {
            const data = this.backpack.serialize();
            localStorage.setItem('backpack_data', data);
            return { success: true, message: '保存成功' };
        } catch (error) {
            return { success: false, message: '保存失败: ' + error.message };
        }
    }

    /**
     * 加载背包数据
     */
    loadBackpack() {
        try {
            const data = localStorage.getItem('backpack_data');
            if (data) {
                const success = this.backpack.deserialize(data, this.itemDatabase);
                if (success) {
                    return { success: true, message: '加载成功' };
                }
            }
            return { success: false, message: '没有保存的数据' };
        } catch (error) {
            return { success: false, message: '加载失败: ' + error.message };
        }
    }
}