/**
 * 物品数据模块
 * 定义游戏中所有物品的基础数据和配置
 */

/**
 * 物品类型枚举
 */
export const ItemType = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    CONSUMABLE: 'consumable',
    MATERIAL: 'material',
    QUEST: 'quest',
    MISC: 'misc'
};

/**
 * 物品稀有度枚举
 */
export const ItemRarity = {
    COMMON: { name: '普通', color: '#9ca3af', level: 1 },
    UNCOMMON: { name: '优秀', color: '#22c55e', level: 2 },
    RARE: { name: '稀有', color: '#3b82f6', level: 3 },
    EPIC: { name: '史诗', color: '#a855f7', level: 4 },
    LEGENDARY: { name: '传说', color: '#f59e0b', level: 5 }
};

/**
 * 物品基础数据结构
 */
export class Item {
    constructor(id, name, type, rarity, maxStack = 1, description = '', icon = '') {
        this.id = id;                    // 物品唯一ID
        this.name = name;                // 物品名称
        this.type = type;                // 物品类型
        this.rarity = rarity;            // 物品稀有度
        this.maxStack = maxStack;        // 最大堆叠数量
        this.description = description;  // 物品描述
        this.icon = icon;                // 物品图标路径
    }
}

/**
 * 物品实例（背包中的具体物品）
 */
export class ItemInstance {
    constructor(item, quantity = 1) {
        this.item = item;          // 物品基础数据
        this.quantity = quantity;  // 当前数量
        this.position = null;      // 在背包中的位置
    }
}

/**
 * 游戏物品数据库
 */
export const ItemDatabase = {
    items: new Map(),

    /**
     * 初始化物品数据
     */
    init() {
        // 武器类
        this.addItem(new Item(1001, '铁剑', ItemType.WEAPON, ItemRarity.COMMON, 1, '一把普通的铁剑，适合新手使用。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(1002, '魔法杖', ItemType.WEAPON, ItemRarity.RARE, 1, '蕴含魔法能量的法杖，能增强法术威力。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(1003, '龙鳞剑', ItemType.WEAPON, ItemRarity.LEGENDARY, 1, '由古龙鳞片锻造的神兵，拥有毁天灭地的力量。', './assets/icons/placeholder.svg'));
        
        // 护甲类
        this.addItem(new Item(2001, '皮甲', ItemType.ARMOR, ItemRarity.COMMON, 1, '用野兽皮革制作的轻甲，提供基础防护。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(2002, '铁甲', ItemType.ARMOR, ItemRarity.UNCOMMON, 1, '由铁片编制的铠甲，防御力较高。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(2003, '魔法长袍', ItemType.ARMOR, ItemRarity.RARE, 1, '附魔的华丽长袍，能提升魔法抗性。', './assets/icons/placeholder.svg'));
        
        // 消耗品类
        this.addItem(new Item(3001, '生命药水', ItemType.CONSUMABLE, ItemRarity.COMMON, 99, '恢复50点生命值。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(3002, '魔法药水', ItemType.CONSUMABLE, ItemRarity.COMMON, 99, '恢复30点魔法值。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(3003, '力量药剂', ItemType.CONSUMABLE, ItemRarity.UNCOMMON, 10, '临时增加10点力量，持续5分钟。', './assets/icons/placeholder.svg'));
        
        // 材料类
        this.addItem(new Item(4001, '铁矿石', ItemType.MATERIAL, ItemRarity.COMMON, 999, '基础的锻造材料。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(4002, '魔法水晶', ItemType.MATERIAL, ItemRarity.RARE, 999, '蕴含魔力的水晶，用于制作魔法物品。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(4003, '龙鳞', ItemType.MATERIAL, ItemRarity.EPIC, 999, '珍贵的古龙鳞片，极为稀有。', './assets/icons/placeholder.svg'));
        
        // 任务物品
        this.addItem(new Item(5001, '古老的钥匙', ItemType.QUEST, ItemRarity.RARE, 1, '一把锈迹斑斑的钥匙，似乎能打开某扇门。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(5002, '神秘卷轴', ItemType.QUEST, ItemRarity.EPIC, 1, '上面记录着古老的咒语。', './assets/icons/placeholder.svg'));
        
        // 杂物类
        this.addItem(new Item(6001, '金币', ItemType.MISC, ItemRarity.COMMON, 99999, '通用的货币。', './assets/icons/placeholder.svg'));
        this.addItem(new Item(6002, '火把', ItemType.MISC, ItemRarity.COMMON, 20, '照亮黑暗的光源。', './assets/icons/placeholder.svg'));
    },

    /**
     * 添加物品到数据库
     */
    addItem(item) {
        this.items.set(item.id, item);
    },

    /**
     * 根据ID获取物品
     */
    getItem(id) {
        return this.items.get(id);
    },

    /**
     * 获取所有物品
     */
    getAllItems() {
        return Array.from(this.items.values());
    },

    /**
     * 根据类型筛选物品
     */
    getItemsByType(type) {
        return this.getAllItems().filter(item => item.type === type);
    },

    /**
     * 根据稀有度筛选物品
     */
    getItemsByRarity(rarity) {
        return this.getAllItems().filter(item => item.rarity === rarity);
    }
};

// 初始化物品数据库
ItemDatabase.init();