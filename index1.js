import { logTree } from './logtree.mjs';

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
};

console.log(logTree(test));
