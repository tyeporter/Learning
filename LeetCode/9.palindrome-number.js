/*
 * @lc app=leetcode id=9 lang=javascript
 *
 * [9] Palindrome Number
 */

// @lc code=start
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    // Convert number to string
    x = String(x);
    // Create pointers
    let ptr1 = 0, ptr2 = x.length - 1;

    // While pointers don't cross
    while (ptr1 < ptr2) {
        // If pointers are not equal...
        if (x[ptr1] !== x[ptr2]) return false;

        // Shift pointers
        ptr1++;
        ptr2--;
    }

    return true
};
// @lc code=end

