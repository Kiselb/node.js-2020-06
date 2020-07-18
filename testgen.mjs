function getTestObject(depth, limit) {
    const test = { name: "0", items: [] };
    const status = { index: 0, limit: limit || randomInteger(10, 50) };
    while(!!status.limit) {
        const node = test.items[test.items.push({ name: '' + ++status.index }) - 1];
        status.limit--;
        if (randomInteger(0, 1)) {
            node.items = [];
            addNode(node.items, ((depth || randomInteger(2, 8)) - 1), status);
        }
    }
    return test;
}

function addNode(items, depth, status) {
    if (depth < 1) return;
    if (status.limit == 0) return;
    const newnode = items[items.push({ name: '' + ++status.index }) - 1]
    status.limit--;
    if (!!randomInteger(0, 1) && status.limit > 0) {
        newnode.items = [];
        addNode(newnode.items, --depth, status);
    }
    return;
}

// https://learn.javascript.ru/task/random-int-min-max
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

export { getTestObject };
