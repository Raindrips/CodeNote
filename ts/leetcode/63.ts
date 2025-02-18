namespace _63 {
    function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
        const dir = [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 0, y: -1 },
        ];
        let d = 0;
        let x = 0;
        let y = 0;

        return 0;
    }

    function bfs(
        arr: number[][],
        visited: number[][],
        x: number,
        y: number,
    ) {}

    function test(obstacleGrid: number[][]) {
        console.log(uniquePathsWithObstacles(obstacleGrid));
    }
}
