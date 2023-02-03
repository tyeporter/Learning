/*
 * @lc app=leetcode id=13 lang=javascript
 *
 * [13] Roman to Integer
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    // Create hash table for roman numeral lookup
    const romanTable = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    };

    // Create variables for pointer and result
    let ptr = 0, result = 0;
    while (ptr < s.length) {
        // Get current number
        let current = romanTable[s.charAt(ptr)];

        if (ptr > 0) { // If pointer > 0...
            // If current number > previous number,
            // subtract previous number * 2 from current number
            const previous = romanTable[s.charAt(ptr - 1)];
            if (current > previous) current -= previous * 2;
        }

        // Add current number to result
        result += current;
        ptr++;
    }

    return result;
};
// @lc code=end

