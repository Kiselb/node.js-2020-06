const stream = require('stream');
const fs = require('fs');
const util = require('util');
const events = require('events');

const finished = util.promisify(stream.finished);

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

async function createBigFile(fileFullName) {

    const bigFileStream = fs.createWriteStream(fileFullName);

    for(let i = 0; i < 20; i++) {
        if (!bigFileStream.write(randomInteger(0, 1000000).toString() + '\n')) {
            await events.once(bigFileStream, 'drain')
        }
    }
    bigFileStream.end();
    await finished(bigFileStream);
}

async function createBigFileChunks(fileFullName, chunkSize) {

    const bigFileStream = fs.createReadStream(fileFullName);

     for await (const chunk of bigFileStream) {
        console.log(chunk);
    }
}
createBigFile('numbers.txt');
createBigFileChunks('numbers.txt');
