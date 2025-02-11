def simulate_match(player1, player2):
    return player1 if player1 < player2 else player2

def double_elimination(players):
    # 正赛和败者组比赛
    winners = list(players)
    losers = []

    # 正赛: 先安排强者对战
    match_results = []
    for i in range(0, len(winners), 2):
        if i + 1 < len(winners):
            winner = simulate_match(winners[i], winners[i+1])
            match_results.append(winner)
            losers.append(winners[i] if winner != winners[i] else winners[i+1])
    winners = match_results

    # 继续模拟败者组和胜者组
    while len(winners) > 1 or len(losers) > 1:
        # 正赛: 从赢家组中匹配
        match_results = []
        for i in range(0, len(winners), 2):
            if i + 1 < len(winners):
                winner = simulate_match(winners[i], winners[i+1])
                match_results.append(winner)
                losers.append(winners[i] if winner != winners[i] else winners[i+1])
        winners = match_results

        # 败者组: 从败者组中匹配
        match_results = []
        for i in range(0, len(losers), 2):
            if i + 1 < len(losers):
                winner = simulate_match(losers[i], losers[i+1])
                match_results.append(winner)
        losers = match_results

    # 最终结果
    if(len(winners)==0):
        return 0,0,[-1]
    final_match_winner = simulate_match(winners[0], losers[0])
    return winners[0], losers[0], final_match_winner

# 16名选手，按1到16排序，1号是最强的
players = list(range(1, 17))

# 进行双败淘汰赛
winner, loser, final_winner = double_elimination(players)

print("最差的最终结果:")
print(f"冠军: {winner}")
print(f"第二名: {loser}")
print(f"总冠军: {final_winner}")
