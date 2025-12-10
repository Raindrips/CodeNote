/**
 * 背包系统主入口文件
 * 负责初始化整个背包系统
 */

// 导入所有模块
import { ItemDatabase, ItemInstance } from './data/items.js';
import { Backpack } from './data/backpack.js';
import { ItemLogic } from './logic/itemLogic.js';
import { BackpackLogic } from './logic/backpackLogic.js';
import { BackpackComponent } from './components/backpackComponent.js';

/**
 * 背包系统主类
 */
class BackpackSystem {
    constructor() {
        this.itemDatabase = ItemDatabase;
        this.backpack = null;
        this.backpackLogic = null;
        this.backpackComponent = null;
        this.isInitialized = false;
        
        // 将必要的类挂载到window对象，以便其他模块使用
        window.ItemInstance = ItemInstance;
        
        this.init();
    }

    /**
     * 初始化系统
     */
    async init() {
        try {
            console.log('🎒 正在初始化背包系统...');
            
            // 创建背包实例
            this.backpack = new Backpack();
            
            // 创建背包逻辑管理器
            this.backpackLogic = new BackpackLogic(this.backpack, this.itemDatabase);
            
            // 创建背包组件
            this.backpackComponent = new BackpackComponent(this.backpackLogic, {
                columns: 5,
                showStats: true,
                showToolbar: true,
                draggable: true
            });
            
            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupUI();
                });
            } else {
                this.setupUI();
            }
            
            // 尝试加载保存的数据
            this.loadSavedData();
            
            // 添加一些测试物品
            this.addTestItems();
            
            this.isInitialized = true;
            console.log('✅ 背包系统初始化完成！');
            
        } catch (error) {
            console.error('❌ 背包系统初始化失败:', error);
        }
    }

    /**
     * 设置UI界面
     */
    setupUI() {
        // 创建主容器
        const container = document.getElementById('app') || document.body;
        
        // 创建标题
        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = `
            <h1>🎒 冒险者背包系统</h1>
            <p>管理你的装备和道具</p>
        `;
        
        // 创建控制面板
        const controlPanel = this.createControlPanel();
        
        // 创建背包容器
        const backpackContainer = document.createElement('div');
        backpackContainer.className = 'backpack-container';
        backpackContainer.id = 'backpack-container';
        
        // 创建背包组件
        const backpackElement = this.backpackComponent.createElement();
        backpackContainer.appendChild(backpackElement);
        
        // 创建快捷工具栏
        const quickBar = this.createQuickBar();
        
        // 添加到页面
        container.appendChild(header);
        container.appendChild(controlPanel);
        container.appendChild(backpackContainer);
        container.appendChild(quickBar);
        
        // 设置事件监听
        this.setupEventListeners();
    }

    /**
     * 创建控制面板
     */
    createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'control-panel';
        
        panel.innerHTML = `
            <div class="control-group">
                <h3>📦 物品管理</h3>
                <div class="control-buttons">
                    <button id="btn-add-random" class="control-btn">添加随机物品</button>
                    <button id="btn-clear-all" class="control-btn">清空背包</button>
                    <button id="btn-save" class="control-btn">保存数据</button>
                    <button id="btn-load" class="control-btn">加载数据</button>
                </div>
            </div>
            
            <div class="control-group">
                <h3>🎯 快速添加</h3>
                <div class="quick-add">
                    <select id="item-selector" class="item-selector">
                        <option value="">选择物品...</option>
                    </select>
                    <input type="number" id="quantity-input" class="quantity-input" value="1" min="1" max="999">
                    <button id="btn-add-selected" class="control-btn">添加</button>
                </div>
            </div>
            
            <div class="control-group">
                <h3>💰 金币管理</h3>
                <div class="gold-controls">
                    <input type="number" id="gold-input" class="gold-input" value="0" min="0">
                    <button id="btn-add-gold" class="control-btn">添加金币</button>
                </div>
            </div>
        `;
        
        return panel;
    }

    /**
     * 创建快捷工具栏
     */
    createQuickBar() {
        const bar = document.createElement('div');
        bar.className = 'quick-bar';
        
        bar.innerHTML = `
            <div class="quick-item" data-item-id="3001" title="生命药水">🧪</div>
            <div class="quick-item" data-item-id="3002" title="魔法药水">💙</div>
            <div class="quick-item" data-item-id="3003" title="力量药剂">💪</div>
            <div class="quick-item" data-item-id="1001" title="铁剑">⚔️</div>
            <div class="quick-item" data-item-id="2001" title="皮甲">🛡️</div>
        `;
        
        // 添加点击事件
        bar.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.quick-item');
            if (itemElement) {
                const itemId = parseInt(itemElement.dataset.itemId);
                this.addItem(itemId, 1);
            }
        });
        
        return bar;
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 添加随机物品
        document.getElementById('btn-add-random').addEventListener('click', () => {
            this.addRandomItems();
        });
        
        // 清空背包
        document.getElementById('btn-clear-all').addEventListener('click', () => {
            if (confirm('确定要清空整个背包吗？')) {
                this.clearBackpack();
            }
        });
        
        // 保存数据
        document.getElementById('btn-save').addEventListener('click', () => {
            this.saveData();
        });
        
        // 加载数据
        document.getElementById('btn-load').addEventListener('click', () => {
            this.loadSavedData();
        });
        
        // 添加选中的物品
        document.getElementById('btn-add-selected').addEventListener('click', () => {
            const itemId = parseInt(document.getElementById('item-selector').value);
            const quantity = parseInt(document.getElementById('quantity-input').value);
            
            if (itemId) {
                this.addItem(itemId, quantity);
            } else {
                this.showNotification('请先选择一个物品', 'warning');
            }
        });
        
        // 添加金币
        document.getElementById('btn-add-gold').addEventListener('click', () => {
            const gold = parseInt(document.getElementById('gold-input').value);
            if (gold > 0) {
                this.backpack.gold += gold;
                this.backpackComponent.updateDisplay();
                this.showNotification(`添加了 ${gold} 金币`, 'success');
            }
        });
        
        // 填充物品选择器
        this.populateItemSelector();
        
        // 拖拽事件监听
        document.addEventListener('item-drop', (e) => {
            this.handleItemDrop(e.detail);
        });
    }

    /**
     * 填充物品选择器
     */
    populateItemSelector() {
        const selector = document.getElementById('item-selector');
        const items = this.itemDatabase.getAllItems();
        
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (${this.getItemTypeName(item.type)})`;
            selector.appendChild(option);
        });
    }

    /**
     * 添加物品
     */
    addItem(itemId, quantity = 1) {
        const result = this.backpackLogic.addItem(itemId, quantity);
        this.showNotification(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            this.backpackComponent.updateDisplay();
        }
        
        return result.success;
    }

    /**
     * 添加随机物品
     */
    addRandomItems() {
        const items = this.itemDatabase.getAllItems();
        const randomCount = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < randomCount; i++) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            const randomQuantity = Math.floor(Math.random() * Math.min(randomItem.maxStack, 10)) + 1;
            
            this.addItem(randomItem.id, randomQuantity);
        }
    }

    /**
     * 添加测试物品
     */
    addTestItems() {
        // 添加一些基础物品
        this.addItem(3001, 10); // 生命药水
        this.addItem(3002, 8);  // 魔法药水
        this.addItem(1001, 1);  // 铁剑
        this.addItem(2001, 1);  // 皮甲
        this.addItem(4001, 50); // 铁矿石
        this.addItem(6001, 100); // 金币
        
        // 设置初始金币
        this.backpack.gold = 500;
        this.backpackComponent.updateDisplay();
    }

    /**
     * 清空背包
     */
    clearBackpack() {
        // 清空所有格子
        this.backpack.slots.forEach(slot => {
            slot.clear();
        });
        
        // 重置金币
        this.backpack.gold = 0;
        
        // 更新显示
        this.backpackComponent.updateDisplay();
        
        this.showNotification('背包已清空', 'info');
    }

    /**
     * 处理物品拖拽
     */
    handleItemDrop(detail) {
        const { draggedData, dropData } = detail;
        
        if (draggedData.type === 'item') {
            // 获取源位置和目标位置
            const sourceSlotIndex = draggedData.data.sourceSlot;
            const targetSlotIndex = dropData.index;
            
            if (sourceSlotIndex !== undefined && targetSlotIndex !== undefined) {
                // 执行移动操作
                const result = this.backpackLogic.moveItem(sourceSlotIndex, targetSlotIndex);
                
                if (result.success) {
                    this.showNotification(result.message, 'success');
                } else {
                    this.showNotification(result.message, 'error');
                }
                
                // 更新显示
                this.backpackComponent.updateDisplay();
            } else {
                this.showNotification(
                    `将 ${draggedData.data.itemId} 放置到格子 ${targetSlotIndex + 1}`,
                    'info'
                );
            }
        }
    }

    /**
     * 保存数据
     */
    saveData() {
        const result = this.backpackLogic.saveBackpack();
        this.showNotification(result.message, result.success ? 'success' : 'error');
    }

    /**
     * 加载保存的数据
     */
    loadSavedData() {
        const result = this.backpackLogic.loadBackpack();
        if (result.success) {
            this.backpackComponent.updateDisplay();
            this.showNotification(result.message, 'success');
        } else if (result.message !== '没有保存的数据') {
            this.showNotification(result.message, 'warning');
        }
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 使用背包组件的通知功能
        if (this.backpackComponent) {
            this.backpackComponent.showNotification(message, type);
        } else {
            // 备用通知方式
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
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
     * 获取系统状态
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            backpackSize: this.backpack.size,
            gold: this.backpack.gold,
            itemCount: this.backpack.getTotalItemCount(),
            usedSlots: this.backpack.getUsedSlots().length
        };
    }
}

// 初始化系统
window.BackpackSystem = new BackpackSystem();

// 暴露一些全局函数供调试使用
window.addItem = (itemId, quantity) => window.BackpackSystem.addItem(itemId, quantity);
window.clearBackpack = () => window.BackpackSystem.clearBackpack();
window.saveBackpack = () => window.BackpackSystem.saveData();
window.loadBackpack = () => window.BackpackSystem.loadSavedData();
window.getBackpackStatus = () => window.BackpackSystem.getStatus();