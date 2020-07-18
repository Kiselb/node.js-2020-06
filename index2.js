import { buildTree } from './tree.mjs';
import { logTree } from './logtree.mjs';

//const argv = require('yargs')
import pkg from 'yargs';
const { argv } = pkg;
argv.usage('Структура каталога.\nИспользование: $0')
    .options({
        path : {
            demand : true,
            alias : 'p',
            description : 'Полный путь к целевому каталогу'
        },
        depth : {
            alias : 'd',
            description : 'Глубина детализации',
            default : undefined,
        },
    })
    .argv
;

const stat = {};

buildTree(argv.path, stat)
.then(folder => { console.log(logTree(folder, argv.depth)); console.log(`${stat.dirs} directories, ${stat.files} files\n`); })
.catch(error => console.log(error));
