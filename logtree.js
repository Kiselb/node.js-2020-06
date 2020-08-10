const CHAR_VL = '\u2503';
const CHAR_HL = '\u2501';
const CHAR_RT = '\u2523';
const CHAR_SL = '\u2517';
const CHAR_SPACE = ' ';
const CHAR_CR = '\n';

exports.CHAR_VL = CHAR_VL;
exports.CHAR_HL = CHAR_HL;
exports.CHAR_RT = CHAR_RT;
exports.CHAR_SL = CHAR_SL;
exports.CHAR_SPACE = CHAR_SPACE;
exports.CHAR_CR = CHAR_CR;

const GLIPH_SIZE = 2;

exports.logTree = function(tree, depth) {
    if (typeof tree !== "object")  throw new Error("Input parameter 'tree' must be an object"); // Object.prototype.toString.call(tree) !== "[object Object]"
    if (!tree.name) throw new Error("Invalid object structure");
    if (depth < 1) throw new Error("Invalid value of parameter 'depth'");
    return (tree.name + CHAR_CR + logItems(tree.items, 1, '', depth));
}

function logItems(items, level, prefix, depth) {
    if (!!depth && level > depth) return '';
    if (Array.isArray(items)) {
        return items.reduce((accumulator, currentValue, index, array) => {
            const gliph = ((index == array.length - 1)? (CHAR_SL): (CHAR_RT)) + CHAR_HL;
            const nextprefix = prefix.substring(0, GLIPH_SIZE * level) + ((index != array.length - 1)? (CHAR_VL): (CHAR_SPACE)) + CHAR_SPACE;
            accumulator = accumulator + prefix + gliph + ((!!currentValue.items)? (currentValue.name + CHAR_CR + logItems(currentValue.items, level + 1, nextprefix, depth)): (currentValue.name + CHAR_CR));
            return accumulator;
        }, '');
    } else {
        return '';
    }
}
