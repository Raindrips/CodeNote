import pygame

pygame.init()
screen = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()
FPS = 60

def update(dt):
    # dt 是秒单位（每帧持续时间），用于动画或游戏逻辑
    pass  # 在此实现每帧逻辑

running = True
while running:
    dt = clock.tick(FPS) / 1000  # 获取每帧时间（秒）
    for evt in pygame.event.get():
        if evt.type == pygame.QUIT:
            running = False

    update(dt)

    screen.fill((30, 30, 30))  # 背景
    # 在此绘制图形...

    pygame.display.flip()

pygame.quit()
