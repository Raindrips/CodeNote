import gymnasium as gym
from gymnasium import spaces
import numpy as np
import pygame
import random


# 动作编码：0=上, 1=右, 2=下, 3=左
class SnakeEnv(gym.Env):
    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": 10}

    def __init__(self, grid_size=10, cell_size=20, render_mode=None, max_steps=1000):
        super().__init__()
        self.grid_size = grid_size
        self.cell_size = cell_size
        self.render_mode = render_mode
        self.max_steps = max_steps

        # 定义动作空间,意思是：有 4 个离散动作 (0,1,2,3)
        self.action_space = spaces.Discrete(3)
        # 定义观测空间,意思是：有 grid_size * grid_size * 3 个连续值
        self.observation_space = spaces.Box(
            low=0, high=1, shape=(grid_size, grid_size, 3), dtype=np.float32
        )

        self.screen = None
        self.clock = None
        self.snake = None
        self.direction = 0
        self.food = None
        self.steps = 0
        self.foodStep = 0.0

    # --- Gymnasium API ---
    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.snake = [(self.grid_size // 2, self.grid_size // 2)]
        self.direction = 0
        self._spawn_food()
        self.steps = 0
        obs = self._get_obs()
        info = self._get_info()
        if self.render_mode == "human":
            self._render_frame()
        return obs, info

    def drawScore(self, score: float):
        if self.screen:
            font = pygame.font.SysFont("Arial", 20)
            score_text = font.render(f"Score: {score:.2f}", True, (255, 255, 255))
            self.screen.blit(score_text, (10, 10))

            pygame.display.flip()
            self.clock.tick(self.metadata["render_fps"])

    # 绑定动作
    def step(self, action):
        reward = 0.0
        # 防 180 度掉头
        # if action == 0 and self.direction != 2:
        #     reward = -1
        #     self.direction = 0
        # elif action == 1 and self.direction != 3:
        #     self.direction = 1
        # elif action == 2 and self.direction != 0:
        #     self.direction = 2
        # elif action == 3 and self.direction != 1:
        #     self.direction = 3

        # 检测是否掉头
        invalid = (
            (action == 0 and self.direction == 2)
            or (action == 1 and self.direction == 3)
            or (action == 2 and self.direction == 0)
            or (action == 3 and self.direction == 1)
        )
        if invalid:
            # 掉头,无效输入
            reward += -0.01
            action = self.direction
        else:
            self.direction = action

        head_x, head_y = self.snake[0]
        old_head = (head_x, head_y)
        if self.direction == 0:
            head_y -= 1
        elif self.direction == 1:
            head_x += 1
        elif self.direction == 2:
            head_y += 1
        elif self.direction == 3:
            head_x -= 1

        new_head = (head_x, head_y)
        food = self.food

        terminated = False
        truncated = False

        # 撞墙/撞自己 -> terminated
        if (
            head_x < 0
            or head_x >= self.grid_size
            or head_y < 0
            or head_y >= self.grid_size
            or new_head in self.snake
        ):
            terminated = True
            reward += -1000.0
        else:
            self.snake.insert(0, new_head)
            if new_head == self.food:
                reward += 1000.0 * (len(self.snake) + 1)
                self.foodStep = 0.0
                self._spawn_food()
            else:
                self.snake.pop()

        # 计算蛇头和食物的曼哈顿距离
        old_distance = abs(old_head[0] - food[0]) + abs(old_head[1] - food[1])
        new_distance = abs(new_head[0] - food[0]) + abs(new_head[1] - food[1])

        if new_distance < old_distance:
            reward += max(0.1, 1 - new_distance * 0.1)  # 走近了
        else:
            # 走远了,会越扣越多,直到吃到了食物
            self.foodStep += 1
            reward += -min(4, self.foodStep * 0.02)

        # 计算步数
        self.steps += 1
        reward += 0.001 * len(self.snake)

        if not terminated and self.steps >= self.max_steps:
            truncated = True

        self.drawScore(reward)
        obs = self._get_obs()
        info = self._get_info()
        if self.render_mode == "human":
            self._render_frame()
        return obs, reward, terminated, truncated, info

    def render(self):
        if self.render_mode == "rgb_array":
            return self._render_frame()
        elif self.render_mode == "human":
            self._render_frame()

    def close(self):
        if self.screen is not None:
            pygame.quit()
            self.screen = None
            self.clock = None

    # --- 辅助 ---
    def _spawn_food(self):
        while True:
            pos = (
                random.randint(0, self.grid_size - 1),
                random.randint(0, self.grid_size - 1),
            )
            if pos not in self.snake:
                self.food = pos
                break

    def _get_obs(self):
        state = np.zeros((self.grid_size, self.grid_size, 3), dtype=np.float32)
        for x, y in self.snake:
            state[y, x, 0] = 0.75

        sx, sy = self.snake[0]
        state[sx, sy, 0] = 1.0

        fx, fy = self.food
        state[fy, fx, 1] = 1.0
        return state

    def _get_info(self):
        return {"length": len(self.snake), "food": self.food}

    def _render_frame(self):
        W = self.grid_size * self.cell_size
        H = self.grid_size * self.cell_size

        if self.render_mode == "human":
            if self.screen is None:
                pygame.init()
                self.screen = pygame.display.set_mode((W, H))
                self.clock = pygame.time.Clock()
            self.screen.fill((0, 0, 0))
            for x, y in self.snake:
                pygame.draw.rect(
                    self.screen,
                    (0, 255, 0),
                    (
                        x * self.cell_size,
                        y * self.cell_size,
                        self.cell_size,
                        self.cell_size,
                    ),
                )
            fx, fy = self.food
            pygame.draw.rect(
                self.screen,
                (255, 0, 0),
                (
                    fx * self.cell_size,
                    fy * self.cell_size,
                    self.cell_size,
                    self.cell_size,
                ),
            )
            pygame.display.flip()
            self.clock.tick(self.metadata["render_fps"])
        else:  # rgb_array
            surface = pygame.Surface((W, H))
            surface.fill((0, 0, 0))
            for x, y in self.snake:
                pygame.draw.rect(
                    surface,
                    (0, 255, 0),
                    (
                        x * self.cell_size,
                        y * self.cell_size,
                        self.cell_size,
                        self.cell_size,
                    ),
                )
            fx, fy = self.food
            pygame.draw.rect(
                surface,
                (255, 0, 0),
                (
                    fx * self.cell_size,
                    fy * self.cell_size,
                    self.cell_size,
                    self.cell_size,
                ),
            )
            return pygame.surfarray.array3d(surface).swapaxes(0, 1)
