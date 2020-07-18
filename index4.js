import { getTestObject } from './testgen.mjs';
import { logTree } from './logtree.mjs';


const test = getTestObject(8, 20);
console.log(logTree(test, 100));
