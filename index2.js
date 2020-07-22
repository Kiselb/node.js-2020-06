const tree = require('./tree.js');
const logtree = require('./logtree.js');

const argv = require('yargs')
    .usage('Структура каталога.\nИспользование: $0')
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

tree.buildTree(argv.path, stat)
.then(folder => { console.log(logtree.logTree(folder, argv.depth)); console.log(`${stat.dirs} directories, ${stat.files} files\n`); })
.catch(error => console.log(error));
