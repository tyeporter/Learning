/*
 * @lc app=leetcode id=1 lang=javascript
 *
 * [1] Two Sum
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Hash table to store numbers and their indexes
    let ht = {};

    for (let i = 0; i < nums.length; i++) {
        // Current number
        const current = nums[i];
        // Difference of target and current number
        const diff = target - current;

        if (diff in ht) {
            // If difference exists in hash table ...
            return [ ht[diff], i ]
        } else { 
            // else ...
            ht[current] = i;
        }
    }
};
// @lc code=end

