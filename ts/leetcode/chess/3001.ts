namespace _3001 {
    type Vec2 = { x: number; y: number };
    // ab 白车位置
    // cd 白象位置
    // ef 黑后位置
    function minMovesToCaptureTheQueen(
        a: number,
        b: number,
        c: number,
        d: number,
        e: number,
        f: number,
    ): number {
        const rookPos = { x: a, y: b };
        const bishopPos = { x: c, y: d };
        const queenPos = { x: e, y: f };
        if (
            moveCheck(rookPos, bishopPos, queenPos) ||
            bishop(bishopPos, rookPos, queenPos)
        ) {
            return 1;
        }
        return 2;
    }

    // 车
    function moveCheck(self: Vec2, other: Vec2, target: Vec2) {
        const moves: Vec2[] = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
        ];

        for (const move of moves) {
            let currentPos: Vec2 = { ...self };
            while (true) {
                const nextPos = { x: currentPos.x + move.x, y: currentPos.y + move.y };
                if (!isInArea(nextPos)) {
                    break;
                }
                if (nextPos.x === other.x && nextPos.y === other.y) {
                    break;
                }
                if (nextPos.x === target.x && nextPos.y === target.y) {
                    return true;
                }
                currentPos = nextPos;
            }
        }
        return false;
    }

    function bishop(pos: Vec2, other: Vec2, target: Vec2) {
        const moves: Vec2[] = [
            { x: 1, y: 1 },
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
        ];

        for (const move of moves) {
            let currentPos: Vec2 = { ...pos };

            while (true) {
                const nextPos = { x: currentPos.x + move.x, y: currentPos.y + move.y };
                if (!isInArea(nextPos)) {
                    break;
                }
                if (nextPos.x === other.x && nextPos.y === other.y) {
                    break;
                }
                if (nextPos.x === target.x && nextPos.y === target.y) {
                    return true;
                }
                currentPos = nextPos;
            }
        }
        return false;
    }

    function isInArea(pos: Vec2) {
        return pos.x >= 1 && pos.x <= 8 && pos.y >= 1 && pos.y <= 8;
    }

    function test() {
        console.log(minMovesToCaptureTheQueen(1, 1, 8, 8, 2, 3));
        console.log(minMovesToCaptureTheQueen(5, 3, 3, 4, 5, 2));
    }

    test();
}
