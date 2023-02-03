/**** Union Types ****/

let statusCode: number | string;

statusCode = 404;
statusCode = 'Not Found';
// statusCode = false;  // Type 'boolean' is not assignable to type 'number | string'
