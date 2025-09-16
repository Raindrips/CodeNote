from stable_baselines3 import DQN
from snake_env import SnakeEnv

env = SnakeEnv(grid_size=10, render_mode="human")
# 加载之前训练好的模型
model = DQN.load("snake_ai")

obs, info = env.reset()
while True:
    action, _ = model.predict(obs)
    obs, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        obs, info = env.reset()
        