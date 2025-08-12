// 定义事实存储类
class FactStore {
    private facts: Map<string, any> = new Map();

    setFact<T>(key: string, value: T) {
        this.facts.set(key, value);
    }

    getFact(key: string): unknown {
        return this.facts.get(key);
    }
}

// 定义条件接口
interface Condition {
    evaluate(factStore: FactStore): boolean;
}

// 定义动作接口
interface Action {
    execute(): void;
}

// 定义规则类
class Rule {
    constructor(
        public id: string,
        public description: string,
        private condition: Condition,
        private action: Action,
        public priority: number = 0,
    ) {}

    evaluate(factStore: FactStore): boolean {
        return this.condition.evaluate(factStore);
    }

    executeAction(): void {
        this.action.execute();
    }
}

// 定义规则系统类
class RuleSystem {
    private rules: Rule[] = [];

    addRule(rule: Rule) {
        this.rules.push(rule);
        // 按优先级对规则排序
        this.rules.sort((a, b) => b.priority - a.priority);
    }

    //执行全部规则
    evaluateRules(factStore: FactStore) {
        for (const rule of this.rules) {
            if (rule.evaluate(factStore)) {
                rule.executeAction();
                // 如果希望只触发一个最高优先级的规则，可以在这里添加 break;
            }
        }
    }

    // 执行优先级最高的规则
    evaluateOneRule(factStore: FactStore) {
        for (const rule of this.rules) {
            if (rule.evaluate(factStore)) {
                rule.executeAction();
                break;
            }
        }
    }
}

// 示例：具体的条件和动作实现
class GemCountCondition implements Condition {
    constructor(private requiredGems: number) {}

    evaluate(factStore: FactStore): boolean {
        const gemCount = factStore.getFact('gemCount') as number;
        return gemCount >= this.requiredGems;
    }
}

class WinGameAction implements Action {
    execute() {
        console.log('Congratulations! You have won the game!');
    }
}

(() => {
    // 使用示例
    const factStore = new FactStore();
    const ruleSystem = new RuleSystem();

    // 设置事实
    factStore.setFact('gemCount', 0);

    // 创建规则
    const collectGemsRule = new Rule(
        'collect_gems_rule',
        'Collect at least 10 gems to win the game.',
        new GemCountCondition(10),
        new WinGameAction(),
        1,
    );

    // 添加规则到规则系统
    ruleSystem.addRule(collectGemsRule);

    // 模拟游戏过程
    function collectGem() {
        let gemCount = factStore.getFact('gemCount') as number;
        factStore.setFact('gemCount', gemCount + 1);
        console.log(`Collected ${gemCount + 1} gems.`);

        // 每次收集宝石后评估规则
        ruleSystem.evaluateRules(factStore);
    }

    // 模拟玩家收集宝石
    for (let i = 0; i < 10; i++) {
        collectGem();
    }
})();
