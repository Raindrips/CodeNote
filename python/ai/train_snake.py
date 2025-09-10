from stable_baselines3 import DQN
from stable_baselines3.common.monitor import Monitor
from snake_env import SnakeEnv

# Gymnasium 环境
env = SnakeEnv(grid_size=10)
env = Monitor(env)  # 可选：记录回报等日志

model = DQN(
    "MlpPolicy",
    env,
    verbose=1,
    buffer_size=50000,
    learning_rate=1e-3,
    batch_size=64,
    train_freq=4,
    target_update_interval=1000,
    exploration_fraction=0.1,
)
# 加载之前训练好的模型
# model = DQN.load("snake_ai", env=env)

model.learn(total_timesteps=300_000)
model.save("snake_ai")
env.close()
