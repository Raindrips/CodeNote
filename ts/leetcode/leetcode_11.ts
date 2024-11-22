namespace _11 {
    function maxArea(height: number[]): number {
        let l = 0;
        let r = height.length - 1;

        let maxNum = 0;
        while (l  < r) {
            let min = Math.min(height[l], height[r]);
            let val = min * (r - l);
            if (val > maxNum) {
                maxNum = val;
            }
            if(height[l]<height[r]){
                l++
            }
            else{
                r--;
            }
            
        }
        return maxNum;
    }

    function test(height: number[]) {
        console.log(maxArea(height));
    }

    test([1,8,6,2,5,4,8,3,7]);
    test([1,1])
}
