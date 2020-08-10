const stream = require('stream');
const fs = require('fs');
const util = require('util');
const events = require('events');
const path = require('path');

const argv = require('yargs')
    .usage('Структура каталога.\nИспользование: $0')
    .options({
        "max-old-space-size" : {
            demand : true,
            alias : 's',
            description : 'Размер Буфера, МБайт'
        }
    })
    .argv
;

const finished = util.promisify(stream.finished);

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

async function createBigFile(fileFullName) {
    const bigFileStream = fs.createWriteStream(fileFullName);
    for(let i = 0; i < 20000000; i++) {
        if (!bigFileStream.write(randomInteger(0, 1000000).toString() + '\n')) {
            await events.once(bigFileStream, 'drain')
        }
    }
    bigFileStream.end();
    await finished(bigFileStream);
}

function getChunkFileName(bigFileFullName, index) {
    const chunkFileName = path.parse(bigFileFullName);
    chunkFileName.name += index;
    delete chunkFileName["base"];
    return path.format(chunkFileName);
}

function getSortedFileName(bigFileFullName) {
    const chunkFileName = path.parse(bigFileFullName);
    chunkFileName.name += "sorted";
    delete chunkFileName["base"];
    return path.format(chunkFileName);
}

async function createChunkFile(chunkFileName, fileData) {
    chunkFileStream = fs.createWriteStream(chunkFileName);
    for(let i = 0; i < fileData.length; i++) {
        if (!chunkFileStream.write(fileData[i] + '\n')) {
            await events.once(chunkFileStream, 'drain')
        }
    }
    chunkFileStream.end();
    await finished(chunkFileStream);
}

async function createBigFileChunks(bigFileFullName, chunkFileSize, files) {
    const bigFileStream = fs.createReadStream(bigFileFullName);
    const fileData = [];
    let rest = Buffer.alloc(0);
    let fileIndex = 0;
    let currentSize = 0;
    for await (const chunk of bigFileStream) {
        const buffer = Buffer.concat([rest, chunk], rest.length + chunk.lastIndexOf('\n') + 1);
        let data = '';
        for(const value of buffer) {
            if (value == 10) {
                fileData.push(data);
                currentSize = currentSize + (data.length + 1);
                data = '';
            } else {
                data += String.fromCharCode(value);
            }
        }
        rest = chunk.subarray(chunk.lastIndexOf('\n') + 1);
        if (currentSize > chunkFileSize) {
            fileData.sort((a, b) => +a - +b);
            await createChunkFile(files[files.push(getChunkFileName(bigFileFullName, fileIndex++)) - 1], fileData);
            fileData.length = 0;
            currentSize = 0;
        }
    }
    fileData.sort((a, b) => +a - +b);
    await createChunkFile(files[files.push(getChunkFileName(bigFileFullName, fileIndex++)) - 1], fileData);
}

function indexMinValue(handlers) {
    let minIndex = 0;
    let minValue = Number.MAX_SAFE_INTEGER;
    for(let i = 0; i < handlers.length; i++) {
        if (!handlers[i].treated) {
            if (handlers[i].value < minValue) {
                minValue = handlers[i].value;
                minIndex = i;
            }
        }
    }
    return minIndex;
}

function dataExists(handlers) {
    for(let i = 0; i < handlers.length; i++) {
        if (!handlers[i].treated) return true;
    }
    return false;
}

async function sortFileChunks(files, bigFileFullName) {
    const handlers = [];
    const sortedBigFileSteam = fs.createWriteStream(getSortedFileName(bigFileFullName));

    for(let i = 0; i < files.length; i++) {
        handlers.push({ stream: fs.createReadStream(files[i]), chunk: null, value: null, chunkIndex: 0, treated: false });
        // await events.once(handlers[handlers.length - 1].stream, 'readable')
        handlers[i].chunk = handlers[handlers.length - 1].stream.read();
        handlers[i].chunkIndex = 0;
        handlers[i].value = +(handlers[i].chunk.subarray(handlers[i].chunkIndex, handlers[i].chunk.indexOf(10)).toString())
        handlers[i].chunkIndex = handlers[i].chunk.indexOf(10) + 1;
    }
    while(dataExists(handlers)) {
        const minIndex = indexMinValue(handlers)
        if (!sortedBigFileSteam.write('' + handlers[minIndex].value + '\n')) {
            await events.once(sortedBigFileSteam, 'drain')
        }
        if (handlers[minIndex].chunk.indexOf(10, handlers[minIndex].chunkIndex) < 0) {
            const rest = handlers[minIndex].chunk.subarray(handlers[minIndex].chunkIndex)
            const chunk = handlers[minIndex].stream.read();
            if (chunk !== null) {
                handlers[minIndex].chunk = Buffer.concat([rest, chunk]);
                handlers[minIndex].chunkIndex = 0;
                handlers[minIndex].value = +(handlers[minIndex].chunk.subarray(handlers[minIndex].chunkIndex, handlers[minIndex].chunk.indexOf(10)).toString());
                handlers[minIndex].chunkIndex = handlers[minIndex].chunk.indexOf(10) + 1;
            } else {
                handlers[minIndex].treated = true;
            }
        } else {
            handlers[minIndex].value = +(handlers[minIndex].chunk.subarray(handlers[minIndex].chunkIndex, handlers[minIndex].chunk.indexOf(10, handlers[minIndex].chunkIndex)).toString());
            handlers[minIndex].chunkIndex = handlers[minIndex].chunk.indexOf(10, handlers[minIndex].chunkIndex) + 1;
        }
    }
    sortedBigFileSteam.end();
    await finished(sortedBigFileSteam);
}

async function run(size) {
    const files = [];
    const ret0 = await createBigFile('numbers.txt');
    const ret1 = await createBigFileChunks('numbers.txt', size * 1000000, files);
    console.dir(files);
    const ret3 = await sortFileChunks(files, 'numbers.txt');
}

const ret = run(+(argv["max-old-space-size"]));
