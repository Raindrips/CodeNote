/**
 * 24点游戏 - 游戏逻辑
 */

// 游戏状态变量
let currentCards = [];
let currentCardValues = [];
let score = 0;
let hasSolution = false;
let allSolutions = [];

// 扑克牌花色和数值映射
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const suitSymbols = {
    'hearts': '♥',
    'diamonds': '♦',
    'clubs': '♣',
    'spades': '♠'
};
const suitColors = {
    'hearts': 'red',
    'diamonds': 'red',
    'clubs': 'black',
    'spades': 'black'
};
const valueMap = {
    1: 'A',
    11: 'J',
    12: 'Q',
    13: 'K'
};

// DOM 元素
const scoreElement = document.getElementById('score');
const resultMessage = document.getElementById('result-message');
const solutionDisplay = document.getElementById('solution-display');
const customSolutionDisplay = document.getElementById('custom-solution-display');
const answerInput = document.getElementById('answer');

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 按钮事件监听
    document.getElementById('new-game-btn').addEventListener('click', startNewGame);
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('show-solution-btn').addEventListener('click', showSolution);
    document.getElementById('custom-calculate-btn').addEventListener('click', calculateCustomNumbers);
    document.getElementById('custom-cards-btn').addEventListener('click', useCustomCards);
    
    // 操作符按钮事件监听
    document.querySelectorAll('.op-btn').forEach(button => {
        button.addEventListener('click', function() {
            const operator = this.getAttribute('data-op');
            insertOperator(operator);
        });
    });
    
    // 初始化游戏
    startNewGame();
});

/**
 * 在输入框中插入操作符
 */
function insertOperator(operator) {
    const cursorPos = answerInput.selectionStart;
    const textBefore = answerInput.value.substring(0, cursorPos);
    const textAfter = answerInput.value.substring(cursorPos);
    
    answerInput.value = textBefore + operator + textAfter;
    
    // 设置光标位置
    const newCursorPos = cursorPos + operator.length;
    answerInput.focus();
    answerInput.setSelectionRange(newCursorPos, newCursorPos);
}

/**
 * 开始新游戏
 */
function startNewGame() {
    // 重置显示
    resultMessage.textContent = '';
    resultMessage.className = '';
    solutionDisplay.style.display = 'none';
    solutionDisplay.textContent = '';
    answerInput.value = '';
    
    // 生成随机卡牌
    generateRandomCards();
    
    // 计算是否有解
    calculateSolutions(currentCardValues);
}

/**
 * 生成随机卡牌
 */
function generateRandomCards() {
    currentCards = [];
    currentCardValues = [];
    
    // 生成4张随机卡牌
    for (let i = 1; i <= 4; i++) {
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const value = Math.floor(Math.random() * 13) + 1; // 1-13
        
        currentCards.push({ suit, value });
        currentCardValues.push(value);
        
        // 更新卡牌显示
        updateCardDisplay(i, suit, value);
    }
    
    // 默认在输入框中显示4个数字
    updateInputWithNumbers();
}

/**
 * 更新输入框中的数字
 */
function updateInputWithNumbers() {
    // 将当前卡牌的数字显示在输入框中，用空格分隔
    answerInput.value = currentCardValues.join(' ');
    
    // 将光标放在最后
    answerInput.focus();
    answerInput.setSelectionRange(answerInput.value.length, answerInput.value.length);
}

/**
 * 更新卡牌显示
 */
function updateCardDisplay(index, suit, value) {
    const cardElement = document.getElementById(`card${index}`);
    const displayValue = valueMap[value] || value;
    const symbol = suitSymbols[suit];
    const color = suitColors[suit];
    
    // 设置卡牌样式
    cardElement.innerHTML = `
        <div style="color: ${color}; font-size: 2rem;">
            <div style="position: absolute; top: 10px; left: 10px;">${displayValue}</div>
            <div style="font-size: 3rem;">${symbol}</div>
            <div style="position: absolute; bottom: 10px; right: 10px; transform: rotate(180deg);">${displayValue}</div>
        </div>
    `;
    
    cardElement.style.backgroundColor = 'white';
    cardElement.style.border = `3px solid ${color === 'red' ? '#ffcdd2' : '#bbdefb'}`;
}

/**
 * 检查用户答案
 */
function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    
    if (!userAnswer) {
        resultMessage.textContent = '请输入你的答案！';
        resultMessage.className = 'wrong-answer';
        return;
    }
    
    // 验证答案
    if (validateAnswer(userAnswer)) {
        score += 10;
        scoreElement.textContent = score;
        resultMessage.textContent = '恭喜你答对了！+10分';
        resultMessage.className = 'correct-answer';
    } else {
        resultMessage.textContent = '答案不正确，请再试一次！';
        resultMessage.className = 'wrong-answer';
    }
}

/**
 * 验证用户答案
 */
function validateAnswer(answer) {
    // 移除所有空格
    answer = answer.replace(/\s+/g, '');
    
    // 检查是否包含所有数字
    const cardValues = [...currentCardValues];
    let answerCopy = answer;
    
    // 移除等号和24
    answerCopy = answerCopy.replace(/=24$/, '');
    
    // 提取所有数字
    const numbersInAnswer = answerCopy.match(/\d+/g) || [];
    
    // 检查是否使用了所有卡牌数字
    if (numbersInAnswer.length !== 4) {
        return false;
    }
    
    // 检查是否只使用了给定的数字
    for (const num of numbersInAnswer) {
        const numValue = parseInt(num, 10);
        const index = cardValues.indexOf(numValue);
        
        if (index === -1) {
            return false;
        }
        
        // 移除已使用的数字
        cardValues.splice(index, 1);
    }
    
    // 检查计算结果是否为24
    try {
        // 替换字母表示的牌
        let evalExpression = answerCopy;
        
        // 计算表达式
        const result = eval(evalExpression);
        
        // 允许浮点数误差
        return Math.abs(result - 24) < 0.0001;
    } catch (error) {
        return false;
    }
}

/**
 * 显示解法
 */
function showSolution() {
    if (allSolutions.length > 0) {
        solutionDisplay.style.display = 'block';
        
        // 显示最多5个解法
        const solutionsToShow = allSolutions.slice(0, 5);
        solutionDisplay.innerHTML = `
            <p>可能的解法：</p>
            <ul>
                ${solutionsToShow.map(sol => `<li>${sol} = 24</li>`).join('')}
            </ul>
            ${allSolutions.length > 5 ? `<p>还有 ${allSolutions.length - 5} 种解法...</p>` : ''}
        `;
    } else {
        solutionDisplay.style.display = 'block';
        solutionDisplay.textContent = '这组牌没有解法，请开始新游戏！';
    }
}

/**
 * 计算24点解法
 */
function calculateSolutions(numbers) {
    allSolutions = [];
    
    // 生成所有可能的数字排列
    const permutations = getAllPermutations(numbers);
    
    // 生成所有可能的运算符组合
    const operators = ['+', '-', '*', '/'];
    const operatorCombinations = [];
    
    for (const op1 of operators) {
        for (const op2 of operators) {
            for (const op3 of operators) {
                operatorCombinations.push([op1, op2, op3]);
            }
        }
    }
    
    // 尝试所有可能的表达式模式
    const patterns = [
        (a, b, c, d, op1, op2, op3) => `((${a}${op1}${b})${op2}${c})${op3}${d}`,
        (a, b, c, d, op1, op2, op3) => `(${a}${op1}${b})${op2}(${c}${op3}${d})`,
        (a, b, c, d, op1, op2, op3) => `(${a}${op1}(${b}${op2}${c}))${op3}${d}`,
        (a, b, c, d, op1, op2, op3) => `${a}${op1}((${b}${op2}${c})${op3}${d})`,
        (a, b, c, d, op1, op2, op3) => `${a}${op1}(${b}${op2}(${c}${op3}${d}))`,
    ];
    
    // 检查所有可能的组合
    const uniqueSolutions = new Set();
    
    for (const perm of permutations) {
        for (const ops of operatorCombinations) {
            for (const pattern of patterns) {
                const expression = pattern(perm[0], perm[1], perm[2], perm[3], ops[0], ops[1], ops[2]);
                
                try {
                    const result = eval(expression);
                    
                    if (Math.abs(result - 24) < 0.0001) {
                        // 格式化表达式，替换数字为卡牌表示
                        let formattedExpression = expression;
                        uniqueSolutions.add(formattedExpression);
                    }
                } catch (error) {
                    // 忽略无效表达式
                }
            }
        }
    }
    
    allSolutions = [...uniqueSolutions];
    hasSolution = allSolutions.length > 0;
}

/**
 * 获取数组的所有排列
 */
function getAllPermutations(array) {
    const result = [];
    
    function permute(arr, m = []) {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                const current = arr.slice();
                const next = current.splice(i, 1);
                permute(current, m.concat(next));
            }
        }
    }
    
    permute(array);
    return result;
}

/**
 * 使用自定义数字
 */
function calculateCustomNumbers() {
    const inputs = document.querySelectorAll('.custom-number');
    const numbers = Array.from(inputs).map(input => parseInt(input.value, 10));
    
    // 验证输入
    if (numbers.some(isNaN) || numbers.some(n => n < 1 || n > 13)) {
        customSolutionDisplay.style.display = 'block';
        customSolutionDisplay.innerHTML = '<p class="wrong-answer">请输入1-13之间的有效数字！</p>';
        return;
    }
    
    // 计算解法
    calculateSolutions(numbers);
    
    // 显示结果
    displayCustomSolutions(numbers);
}

/**
 * 使用自定义卡牌
 */
function useCustomCards() {
    const cards = [];
    const cardValues = [];
    
    for (let i = 1; i <= 4; i++) {
        const suit = document.getElementById(`suit${i}`).value;
        const value = parseInt(document.getElementById(`value${i}`).value, 10);
        
        cards.push({ suit, value });
        cardValues.push(value);
        
        // 更新卡牌显示
        updateCardDisplay(i, suit, value);
    }
    
    currentCards = cards;
    currentCardValues = cardValues;
    
    // 计算解法
    calculateSolutions(cardValues);
    
    // 显示结果
    displayCustomSolutions(cardValues);
    
    // 重置游戏区域
    resultMessage.textContent = '';
    solutionDisplay.style.display = 'none';
    
    // 默认在输入框中显示4个数字
    updateInputWithNumbers();
}

/**
 * 显示自定义数字的解法
 */
function displayCustomSolutions(numbers) {
    customSolutionDisplay.style.display = 'block';
    
    if (allSolutions.length > 0) {
        // 显示最多5个解法
        const solutionsToShow = allSolutions.slice(0, 5);
        customSolutionDisplay.innerHTML = `
            <p>数字 ${numbers.join(', ')} 的24点解法：</p>
            <ul>
                ${solutionsToShow.map(sol => `<li>${sol} = 24</li>`).join('')}
            </ul>
            ${allSolutions.length > 5 ? `<p>还有 ${allSolutions.length - 5} 种解法...</p>` : ''}
        `;
    } else {
        customSolutionDisplay.innerHTML = `<p>数字 ${numbers.join(', ')} 没有24点解法！</p>`;
    }
}
