import pygame

pygame.init()
screen = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()

# 颜色定义
BLACK = (0, 0, 0)
RED   = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE  = (0, 0, 255)

running = True
while running:
    for evt in pygame.event.get():
        if evt.type == pygame.QUIT:
            running = False

    screen.fill(BLACK)

    # 绘制线、矩形、圆形
    pygame.draw.line(screen, RED,   (50, 50),  (200, 50), 5)
    pygame.draw.rect(screen, GREEN, pygame.Rect(100, 100, 150, 80), 3)
    pygame.draw.circle(screen, BLUE, (320, 240), 50, 0)  # 0 = 填充

    pygame.display.flip()
    clock.tick(30)  # 限制帧率

pygame.quit()
