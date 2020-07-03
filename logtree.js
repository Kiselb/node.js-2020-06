const fs = require('fs');
const path = require('path');

exports.buildTree = function(path) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof path === 'string') {
                if (path.length === 0) resolve({});
                fs.access(path, fs.constants.F_OK | fs.constants.R_OK, (err) => {
                    if (err) throw reject("В доступе отказано")
                    const root = { name: path, items: []};
                    buildNode(root)
                    .then(() => resolve(root))
                    .catch(error => reject(error));
                });
            } else throw "Недопустимое значение параметра";
        }
        catch(exception) {
            reject(exception)
        }
    })
}

function buildNode(parent, childPath) {
    const stack = [];
    return new Promise((resolve, reject) => {
        const nodePath = (!!childPath)? (childPath): (parent.name)
        fs.readdir(nodePath, { encoding: 'UTF-8', withFileTypes: true}, (err, files) => {
            try {
                if (err) throw "Ошибка чтения каталога"
                files.forEach(file => {
                    const node = parent.items[parent.items.push({ name: file.name }) - 1];
                    if (file.isDirectory()) {
                        node.items = [];
                        stack.push(buildNode(node, path.join(nodePath, file.name)));
                    }
                });
                Promise.all(stack).then(() => resolve());
            }
            catch(exception) {
                reject(exception);
            }
        });
    })
}

const CHAR_VL = '\u2503';
const CHAR_HL = '\u2501';
const CHAR_RT = '\u2523';
const CHAR_SL = '\u2517';
const CHAR_SPACE = ' ';
const CHAR_CR = '\n';
const GLIPH_SIZE = 2;

exports.logTree = function(tree, depth) {
    if (typeof tree !== "object") throw "Входной параметр tree должен быть объектом"; // Object.prototype.toString.call(tree) !== "[object Object]"
    if (!tree.name) throw "Недопустимая структура объекта";
    if (depth < 1) throw "Недопустимое значение параметра 'Глубина'";
    return (tree.name + '\n' + logItems(tree.items, 1, '', depth));
}

function logItems(items, level, prefix, depth) {
    if (!!depth && level > depth) return '';
    if (Array.isArray(items)) {
        return items.reduce((accumulator, currentValue, index, array) => {
            const gliph = ((index === array.length - 1)? (CHAR_SL): (CHAR_RT)) + CHAR_HL;
            const nextprefix = prefix.substring(0, GLIPH_SIZE * level) + ((index != array.length - 1)? (CHAR_VL): (CHAR_SPACE)) + CHAR_SPACE;
            accumulator = accumulator + prefix + gliph + ((!!currentValue.items)? (currentValue.name + CHAR_CR + logItems(currentValue.items, level + 1, nextprefix, depth)): (currentValue.name + CHAR_CR));
            return accumulator;
        }, '');
    } else {
        return '';
    }
}
