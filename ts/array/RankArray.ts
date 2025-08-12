(() => {
    /**
     * 创建一个二维数组
     * Creates a multi-dimensional array filled with zeros based on the given dimensions.
     *
     * @param dimensions A rest parameter representing the lengths of each dimension.
     * e.g., (4) for a 1D array of length 4.
     * e.g., (2, 3) for a 2x3 2D array.
     * e.g., (3, 3, 3) for a 3x3x3 3D array, and so on.
     * @returns A multi-dimensional array initialized with zeros.
     */
    function createMultiDimensionalArray<T = number>(
        fill: T,
        ...dimensions: number[]
    ): any {
        if (dimensions.length === 0) {
            return fill;
        }
        const currentDimLength = dimensions[0];
        const remainingDimensions = dimensions.slice(1);

        const array: T[] = [];
        for (let i = 0; i < currentDimLength; i++) {
            array.push(
                createMultiDimensionalArray(fill, ...remainingDimensions),
            );
        }
        return array;
    }

    function test() {
        // 1D Array (length 4)
        const array1D = createMultiDimensionalArray(0, 4);
        console.log('1D Array (4):', array1D);
        // Expected output: [0, 0, 0, 0]

        // 2D Array (2x3)
        const array2D = createMultiDimensionalArray(1, 2, 3);
        console.log('2D Array (2x3):', array2D);
        // Expected output: [[0, 0, 0], [0, 0, 0]]

        // 3D Array (3x2x2)
        const array3D = createMultiDimensionalArray('a', 3, 2, 2);
        console.log('3D Array (3x2x2):', array3D);

        // Invalid dimension (e.g., 0)
        const emptyArray = createMultiDimensionalArray('', 0, 5);
        console.log('Empty outer dimension:', emptyArray);
        // Expected output: [] (an empty array because the first dimension's length is 0)
    }

    test();
})();
