def double_elimination(players):
    # 初始化比赛结构
    from collections import deque
    winners = []
    losers = []
    
    # 第一轮比赛
    for a, b in players:
        if a < b:
            winners.append(a)
            losers.append(b)
        else:
            winners.append(b)
            losers.append(a)
    
    # 胜者组进程
    w_bracket = [winners]
    while len(w_bracket[-1]) > 1:
        new_round = []
        for i in range(0, len(w_bracket[-1]), 2):
            a, b = w_bracket[-1][i], w_bracket[-1][i+1]
            new_round.append(a if a < b else b)
        w_bracket.append(new_round)
    
    # 败者组进程
    l_bracket = deque([losers])
    final_rank = []
    
    while l_bracket and len(l_bracket[0]) > 1:
        current = l_bracket.popleft()
        new_round = []
        for i in range(0, len(current), 2):
            a, b = current[i], current[i+1]
            winner = a if a < b else b
            new_round.append(winner)
            if a != winner and b != winner:  # 记录被淘汰者
                final_rank.extend(sorted([a, b], reverse=True))
        if len(l_bracket) > 0:
            l_bracket.append(new_round)
        else:
            l_bracket.appendleft(new_round)
    
    # 构建最终排名
    final_rank += [l_bracket[0][0]] if l_bracket else []
    final_rank.reverse()
    
    # 添加胜者组冠军
    champion = w_bracket[-1][0]
    final_rank.append(champion)
    
    return final_rank[::-1]  # 从最后一名到冠军排序

# 最佳破坏性排列
optimal_bracket = [(1,16), (9,8), (5,12), (13,4), (3,14), (11,6), (7,10), (15,2)]

# 执行赛程
result = double_elimination(optimal_bracket)

# 输出结果
print("最优破坏性排列：")
for i, match in enumerate(optimal_bracket, 1):
    print(f"第{i}场：{match[0]} vs {match[1]}")

print("\n最终排名（从最后一名到冠军）：")
print("第16名到第1名：", result)