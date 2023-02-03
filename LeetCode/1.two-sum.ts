/*
 * @lc app=leetcode id=1 lang=typescript
 *
 * [1] Two Sum
 */

// @lc code=start
function twoSum(nums: number[], target: number): number[] {
    // Hash table to store numbers and their indexes
    let ht: { [key: number]: number } = {};

    for (let i = 0; i < nums.length; i++) {
        // Current number
        const current = nums[i];
        // Difference of target and current number
        const diff = target - current;

        if (diff in ht) {
            // If difference exists in hash table ...
            return [ ht[diff], i ];
        } else {
            // else ...
            ht[current] = i;
        }
    }

    return [];
};
// @lc code=end

