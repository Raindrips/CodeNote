import pygame

pygame.init()
screen = pygame.display.set_mode((400, 300))
clock = pygame.time.Clock()

# 记录键状态
keys_down = {}

def on_key_down(key):
    print(f"{key} down")

def on_key_up(key):
    print(f"{key} up")

running = True
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

    screen.fill((50, 50, 50))
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
