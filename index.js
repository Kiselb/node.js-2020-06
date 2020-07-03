const pathtree = require('./logtree')
const test = {
    "name": 1,
    "items": [
        {
            "name": 2,
            "items": [
                { "name": 3 },
                { "name": 4,
                  "items": [
                        { "name": 7 },
                        { "name": 8,
                          "items": [
                              { "name": 10}
                          ]   
                        }
                  ]
                },
                { "name": 9}
            ]
        },
        {
            "name": 5,
            "items": [
                { "name": 6 }
            ]
        }
    ]
}

console.log(pathtree.logTree(test));
pathtree.buildTree("I:\\Документация") // "I:\\Документация\\Legion"
.then(folder => console.log(pathtree.logTree(folder)))
.catch(error => console.log(error));
