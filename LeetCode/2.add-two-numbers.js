/*
 * @lc app=leetcode id=2 lang=javascript
 *
 * [2] Add Two Numbers
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    // Create variables to reference head and next nodes
    let head = null, next = null;
    // Create variables to keep track of nodes and carry
    let node1 = l1, node2 = l2, carry = 0;

    while (node1 !== null || node2 !== null) {
        // Get result of addition
        let result = (node1 === null) ? node2.val + carry :
                     (node2 === null) ? node1.val + carry :
                     node1.val + node2.val + carry;

        if (result >= 10) { // If result >= 10...
            // Subtract 10 from result and store carry
            result -= 10;
            carry = 1;
        } else {
            // Set carry to zero
            carry = 0;
        }

        if (head) { // If head variable references node...
            next = next.next = new ListNode(result);
        } else { // else...
            next = head = new ListNode(result);
        }

        // Move to next nodes
        node1 = (node1 == null) ? null : node1.next;
        node2 = (node2 == null) ? null : node2.next;
    }

    // If there's a remaining carry, add it as last node
    if (carry) next.next = new ListNode(carry);

    return head;
};
// @lc code=end

