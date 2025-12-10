/**
 * 物品逻辑模块
 * 处理物品相关的业务逻辑
 */

import { ItemInstance } from '../data/items.js';

/**
 * 物品逻辑管理器
 */
export class ItemLogic {
    constructor() {
        this.itemEffects = new Map(); // 物品效果映射
        this.initItemEffects();
    }

    /**
     * 初始化物品效果
     */
    initItemEffects() {
        // 消耗品效果
        this.itemEffects.set(3001, this.useHealthPotion.bind(this)); // 生命药水
        this.itemEffects.set(3002, this.useManaPotion.bind(this));  // 魔法药水
        this.itemEffects.set(3003, this.useStrengthPotion.bind(this)); // 力量药剂
        
        // 装备效果（示例）
        this.itemEffects.set(1001, this.equipWeapon.bind(this));     // 铁剑
        this.itemEffects.set(1002, this.equipWeapon.bind(this));     // 魔法杖
        this.itemEffects.set(2001, this.equipArmor.bind(this));      // 皮甲
        this.itemEffects.set(2002, this.equipArmor.bind(this));      // 铁甲
    }

    /**
     * 使用物品
     */
    useItem(itemInstance) {
        if (!itemInstance || !itemInstance.item) {
            return { success: false, message: '无效的物品' };
        }

        const item = itemInstance.item;
        
        // 检查是否有使用效果
        const effect = this.itemEffects.get(item.id);
        if (effect) {
            const result = effect(itemInstance);
            if (result.success) {
                // 消耗品使用后减少数量
                if (item.type === 'consumable') {
                    itemInstance.quantity--;
                    if (itemInstance.quantity <= 0) {
                        return { success: true, message: result.message, consumed: true };
                    }
                }
            }
            return result;
        }

        // 默认消息
        return { 
            success: false, 
            message: `无法使用 ${item.name}，这可能不是消耗品。` 
        };
    }

    /**
     * 丢弃物品
     */
    dropItem(itemInstance, quantity = 1) {
        if (!itemInstance || !itemInstance.item) {
            return { success: false, message: '无效的物品' };
        }

        if (itemInstance.quantity < quantity) {
            return { success: false, message: '物品数量不足' };
        }

        const itemName = itemInstance.item.name;
        
        // 减少物品数量
        itemInstance.quantity -= quantity;
        
        return { 
            success: true, 
            message: `丢弃了 ${quantity} 个 ${itemName}`
        };
    }

    /**
     * 获取物品详细信息
     */
    getItemDetails(itemInstance) {
        if (!itemInstance || !itemInstance.item) {
            return null;
        }

        const item = itemInstance.item;
        const details = {
            name: item.name,
            type: this.getItemTypeName(item.type),
            rarity: item.rarity.name,
            rarityColor: item.rarity.color,
            quantity: itemInstance.quantity,
            maxStack: item.maxStack,
            description: item.description,
            icon: item.icon,
            canStack: item.maxStack > 1,
            canUse: this.itemEffects.has(item.id),
            id: item.id
        };

        // 添加类型特定的信息
        switch (item.type) {
            case 'weapon':
                details.category = '武器';
                details.equippable = true;
                break;
            case 'armor':
                details.category = '护甲';
                details.equippable = true;
                break;
            case 'consumable':
                details.category = '消耗品';
                details.consumable = true;
                break;
            case 'material':
                details.category = '材料';
                details.stackable = true;
                break;
            case 'quest':
                details.category = '任务物品';
                details.questItem = true;
                break;
            default:
                details.category = '杂物';
        }

        return details;
    }

    /**
     * 获取物品类型名称
     */
    getItemTypeName(type) {
        const typeNames = {
            'weapon': '武器',
            'armor': '护甲',
            'consumable': '消耗品',
            'material': '材料',
            'quest': '任务物品',
            'misc': '杂物'
        };
        return typeNames[type] || '未知';
    }

    /**
     * 检查物品是否可以堆叠
     */
    canStack(item1, item2) {
        if (!item1 || !item2) return false;
        return item1.item.id === item2.item.id && 
               item1.item.maxStack > 1 &&
               item2.item.maxStack > 1;
    }

    /**
     * 合并物品堆叠
     */
    mergeStacks(target, source) {
        if (!this.canStack(target, source)) {
            return false;
        }

        const maxStack = target.item.maxStack;
        const totalQuantity = target.quantity + source.quantity;
        
        if (totalQuantity <= maxStack) {
            target.quantity = totalQuantity;
            return true; // 完全合并
        } else {
            target.quantity = maxStack;
            source.quantity = totalQuantity - maxStack;
            return false; // 部分合并
        }
    }

    // ===== 物品使用效果实现 =====

    /**
     * 使用生命药水
     */
    useHealthPotion(itemInstance) {
        // 这里可以添加实际的游戏逻辑
        return { 
            success: true, 
            message: '恢复了50点生命值！',
            effect: { type: 'heal', value: 50 }
        };
    }

    /**
     * 使用魔法药水
     */
    useManaPotion(itemInstance) {
        return { 
            success: true, 
            message: '恢复了30点魔法值！',
            effect: { type: 'mana', value: 30 }
        };
    }

    /**
     * 使用力量药剂
     */
    useStrengthPotion(itemInstance) {
        return { 
            success: true, 
            message: '力量增加了10点，持续5分钟！',
            effect: { type: 'buff', stat: 'strength', value: 10, duration: 300 }
        };
    }

    /**
     * 装备武器
     */
    equipWeapon(itemInstance) {
        return { 
            success: true, 
            message: `装备了 ${itemInstance.item.name}！`,
            effect: { type: 'equip', item: itemInstance.item }
        };
    }

    /**
     * 装备护甲
     */
    equipArmor(itemInstance) {
        return { 
            success: true, 
            message: `装备了 ${itemInstance.item.name}！`,
            effect: { type: 'equip', item: itemInstance.item }
        };
    }
}