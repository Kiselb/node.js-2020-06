const fs = require('fs');
const path = require('path');

exports.buildTree = function(path, stat) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof stat != "object") throw "Не задан объект статистики";
            if (typeof stat.dirs == "undefined") stat.dirs = 0;
            if (typeof stat.files == "undefined") stat.files = 0;
            if (typeof path == "string") {
                if (path.length == 0) throw "Не задан начальный путь каталога";
                fs.access(path, fs.constants.F_OK | fs.constants.R_OK, (err) => {
                    if (err) throw reject("В доступе отказано")
                    const root = { name: path, items: []};
                    buildNode(root, stat)
                    .then(() => resolve(root))
                    .catch(error => reject(error));
                });
            } else throw "Недопустимое значение параметра пути каталога";
        }
        catch(exception) {
            reject(exception)
        }
    })
}

function buildNode(parent, stat, childPath) {
    const stack = [];
    return new Promise((resolve, reject) => {
        const nodePath = (!!childPath)? (childPath): (parent.name)
        fs.readdir(nodePath, { encoding: 'UTF-8', withFileTypes: true}, (err, files) => {
            try {
                if (err) throw "Ошибка чтения каталога"
                files.forEach(file => {
                    const node = parent.items[parent.items.push({ name: file.name }) - 1];
                    if (file.isDirectory()) {
                        stat.dirs++;
                        node.items = [];
                        stack.push(buildNode(node, stat, path.join(nodePath, file.name)));
                    } else {
                        if (file.isFile) stat.files++;
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
