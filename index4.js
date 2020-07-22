const testgen = require('./testgen.js');
const logtree = require( './logtree.js');


const test = testgen.getTestObject(8, 20);
console.log(logtree.logTree(test, 100));
