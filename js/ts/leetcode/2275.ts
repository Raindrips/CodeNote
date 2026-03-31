namespace _2275 {
  function largestCombination(candidates: number[]): number {
    let left = 0;
    let right = 1;
    let result=0;
    for (let i = 0; i < candidates.length; i++) {
        let current = candidates[i];
        result=candidates[left]&=candidates[right];
        
        
    }
    return [];
  }
}
