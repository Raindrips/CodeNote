import tkinter as tk
import random
import heapq

CELL_SIZE = 30
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600

class Grid:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.walls = [[False for _ in range(height)] for _ in range(width)]
        self.path = [[False for _ in range(height)] for _ in range(width)]
        self.open_set = [[False for _ in range(height)] for _ in range(width)]
        self.closed_set = [[False for _ in range(height)] for _ in range(width)]
        self.start = None
        self.end = None

    def is_wall(self, x, y):
        return self.walls[x][y]

    def is_valid(self, x, y):
        return 0 <= x < self.width and 0 <= y < self.height

    def reset_path(self):
        for x in range(self.width):
            for y in range(self.height):
                self.path[x][y] = False
                self.open_set[x][y] = False
                self.closed_set[x][y] = False

    def add_wall(self, x, y):
        if self.is_valid(x, y) and (x, y) != self.start and (x, y) != self.end:
            self.walls[x][y] = True

    def remove_wall(self, x, y):
        if self.is_valid(x, y):
            self.walls[x][y] = False

def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def a_star(grid, start, end):
    open_heap = []
    heapq.heappush(open_heap, (0, start))
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, end)}
    
    grid.open_set[start[0]][start[1]] = True
    
    while open_heap:
        _, current = heapq.heappop(open_heap)
        grid.open_set[current[0]][current[1]] = False
        grid.closed_set[current[0]][current[1]] = True
        
        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path, came_from
        
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            neighbor = (current[0] + dx, current[1] + dy)
            if not grid.is_valid(neighbor[0], neighbor[1]):
                continue
            if grid.is_wall(neighbor[0], neighbor[1]):
                continue
            if grid.closed_set[neighbor[0]][neighbor[1]]:
                continue
            
            tentative_g_score = g_score[current] + 1
            
            if tentative_g_score < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, end)
                
                if not grid.open_set[neighbor[0]][neighbor[1]]:
                    heapq.heappush(open_heap, (f_score[neighbor], neighbor))
                    grid.open_set[neighbor[0]][neighbor[1]] = True
    
    return None, came_from

def draw_grid(canvas, grid):
    canvas.delete("all")
    
    for x in range(grid.width):
        for y in range(grid.height):
            x1 = x * CELL_SIZE
            y1 = y * CELL_SIZE
            x2 = x1 + CELL_SIZE
            y2 = y1 + CELL_SIZE
            
            if grid.walls[x][y]:
                canvas.create_rectangle(x1, y1, x2, y2, fill="gray", outline="darkgray")
            elif grid.path[x][y]:
                canvas.create_rectangle(x1, y1, x2, y2, fill="green", outline="black")
            elif grid.closed_set[x][y]:
                canvas.create_rectangle(x1, y1, x2, y2, fill="orange", outline="black")
            elif grid.open_set[x][y]:
                canvas.create_rectangle(x1, y1, x2, y2, fill="yellow", outline="black")
            else:
                canvas.create_rectangle(x1, y1, x2, y2, fill="white", outline="lightgray")
    
    if grid.start:
        x, y = grid.start
        x1 = x * CELL_SIZE + 5
        y1 = y * CELL_SIZE + 5
        x2 = x1 + CELL_SIZE - 10
        y2 = y1 + CELL_SIZE - 10
        canvas.create_oval(x1, y1, x2, y2, fill="blue")
        canvas.create_text(x * CELL_SIZE + CELL_SIZE//2, y * CELL_SIZE + CELL_SIZE//2,
                          text="S", fill="white", font=("Arial", 12, "bold"))
    
    if grid.end:
        x, y = grid.end
        x1 = x * CELL_SIZE + 5
        y1 = y * CELL_SIZE + 5
        x2 = x1 + CELL_SIZE - 10
        y2 = y1 + CELL_SIZE - 10
        canvas.create_oval(x1, y1, x2, y2, fill="red")
        canvas.create_text(x * CELL_SIZE + CELL_SIZE//2, y * CELL_SIZE + CELL_SIZE//2,
                          text="E", fill="white", font=("Arial", 12, "bold"))

def handle_click(event, canvas, grid, is_right_click):
    x = event.x // CELL_SIZE
    y = event.y // CELL_SIZE
    
    if not grid.is_valid(x, y):
        return
    
    if is_right_click:
        grid.end = (x, y)
    else:
        grid.start = (x, y)
    
    grid.reset_path()
    draw_grid(canvas, grid)
    
    if grid.start and grid.end:
        start_search(canvas, grid)

def start_search(canvas, grid):
    path, _ = a_star(grid, grid.start, grid.end)
    
    if path:
        for x, y in path:
            grid.path[x][y] = True
    else:
        print("No path found!")
    
    draw_grid(canvas, grid)

def generate_walls(grid, percentage=0.15):
    for x in range(grid.width):
        for y in range(grid.height):
            if random.random() < percentage:
                grid.walls[x][y] = True

def clear_all(canvas, grid):
    grid.start = None
    grid.end = None
    for x in range(grid.width):
        for y in range(grid.height):
            grid.walls[x][y] = False
            grid.path[x][y] = False
            grid.open_set[x][y] = False
            grid.closed_set[x][y] = False
    draw_grid(canvas, grid)

def toggle_wall(event, canvas, grid):
    x = event.x // CELL_SIZE
    y = event.y // CELL_SIZE
    
    if not grid.is_valid(x, y):
        return
    
    if grid.walls[x][y]:
        grid.remove_wall(x, y)
    else:
        grid.add_wall(x, y)
    
    grid.reset_path()
    draw_grid(canvas, grid)

def main():
    root = tk.Tk()
    root.title("A* Pathfinding Visualization")
    
    canvas = tk.Canvas(root, width=WINDOW_WIDTH, height=WINDOW_HEIGHT)
    canvas.pack()
    
    grid = Grid(WINDOW_WIDTH // CELL_SIZE, WINDOW_HEIGHT // CELL_SIZE)
    generate_walls(grid)
    
    frame = tk.Frame(root)
    frame.pack(pady=5)
    
    clear_btn = tk.Button(frame, text="Clear All", command=lambda: clear_all(canvas, grid))
    clear_btn.pack(side=tk.LEFT, padx=5)
    
    walls_btn = tk.Button(frame, text="Generate Walls", command=lambda: generate_walls(grid) or draw_grid(canvas, grid))
    walls_btn.pack(side=tk.LEFT, padx=5)
    
    help_label = tk.Label(root, text="Left-click: Set Start | Right-click: Set End | Middle-click: Toggle Wall")
    help_label.pack(pady=2)
    
    canvas.bind("<Button-1>", lambda e: handle_click(e, canvas, grid, False))
    canvas.bind("<Button-3>", lambda e: handle_click(e, canvas, grid, True))
    canvas.bind("<Button-2>", lambda e: toggle_wall(e, canvas, grid))
    
    draw_grid(canvas, grid)
    
    root.mainloop()

if __name__ == "__main__":
    main()