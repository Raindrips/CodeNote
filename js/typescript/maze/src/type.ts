enum WallMask {
    Top = 1 << 0,
    Right = 1 << 1,
    Bottom = 1 << 2,
    Left = 1 << 3,
}

class MazeCell {
    wallMask =
        WallMask.Top |
        WallMask.Right |
        WallMask.Bottom |
        WallMask.Left;

    visited = false;
}