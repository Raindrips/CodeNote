import pygame

# 初始化
pygame.init()
screen = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()
FPS = 60

# 颜色
BLACK, WHITE, RED, GREEN, BLUE = (
    (20, 20, 20),
    (230, 230, 230),
    (230, 0, 0),
    (0, 230, 0),
    (0, 0, 230),
)
keys_down = {}


def on_key_down(k):
    print(f"Key {pygame.key.name(k)} DOWN")


def on_key_up(k):
    print(f"Key {pygame.key.name(k)} UP")


def init():

    pass


def update(dt):
    # 可添加逻辑，使用 dt 时间差
    pass


def draw():
    screen.fill(WHITE)

    # 绘制示例图形
    pygame.draw.line(screen, RED, (50, 50), (200, 50), 5)
    pygame.draw.rect(screen, GREEN, pygame.Rect(100, 100, 150, 80), 3)
    pygame.draw.circle(screen, BLUE, (320, 240), 50, 0)
    pygame.draw.rect(screen, BLACK, pygame.Rect(10, 10, 30, 30), 0)

    pygame.display.flip()


## ----
running = True
dt = 0
init()
while running:

    for evt in pygame.event.get():
        if evt.type == pygame.QUIT:
            running = False
        elif evt.type == pygame.KEYDOWN:
            if not keys_down.get(evt.key, False):
                keys_down[evt.key] = True
                on_key_down(evt.key)
        elif evt.type == pygame.KEYUP:
            keys_down[evt.key] = False
            on_key_up(evt.key)

    update(dt)
    draw()
    dt = clock.tick(FPS) / 1000.0

pygame.quit()
# end
