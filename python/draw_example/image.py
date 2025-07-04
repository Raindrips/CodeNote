import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Image Blit Example")

# 加载图片，推荐使用 convert()/convert_alpha() 以优化显示性能
# convert 无透明通道  convert_alpha() 带透明通道
image = pygame.image.load("res/1.png").convert_alpha()
rect = image.get_rect()
rect.center = (400, 300)  # 将图片中心设置到窗口中心

running = True
while running:
    for evt in pygame.event.get():
        if evt.type == pygame.QUIT:
            running = False

    screen.fill((200, 200, 200))  # 背景填充
    # 在屏幕上绘制图片
    screen.blit(image, rect)
    pygame.display.flip()

pygame.quit()
