/**** Strings ****/

var s1: string = 'This is a string defined with "var"';
let s2: string = 'This is a string defined with "let"';

console.log(s1);
console.log(s2);

// String Interpolation

let user = 'Peter';
let greeting = `Hello ${user}!`;

console.log(greeting);

// String Length

console.log(greeting.length);

// Getting Character

console.log(greeting.charAt(0));

// Getting index of Character

console.log(greeting.indexOf('o'));

// Getting Last Index of Character

console.log(greeting.lastIndexOf('e'));
