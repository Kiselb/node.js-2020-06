const logtree = require('./logtree.js');

test('test param is not an object', () => {
    function testIsObject() {
        logtree.logTree(undefined);
    }
    expect(testIsObject).toThrow("Input parameter 'tree' must be an object");
});
test('test param is invalid object', () => {
    function testInvalidObject() {
        logtree.logTree({})
    }
    expect(testInvalidObject).toThrowError("Invalid object structure");
});
test('test depth param is invalid', () => {
    function testInvalidDepthParam() {
        logtree.logTree({ "name": 1 }, -1)
    }
    expect(testInvalidDepthParam).toThrowError("Invalid value of parameter 'depth'");
});
test('simple valid object test', () => {
    expect(logtree.logTree({ "name": 1 })).toBe(`1${logtree.CHAR_CR}`);
});
test('complex valid object test', () => {
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
    //expect(logtree.logTree(test)).toBe("1\n┣━2\n┃ ┣━3\n┃ ┣━4\n┃ ┃ ┣━7\n┃ ┃ ┗━8\n┃ ┃   ┗━10\n┃ ┗━9\n┗━5\n  ┗━6\n");
    expect(logtree.logTree(test)).toBe(
        `1${logtree.CHAR_CR}${logtree.CHAR_RT}${logtree.CHAR_HL}`
        + `2${logtree.CHAR_CR}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_RT}${logtree.CHAR_HL}`
        + `3${logtree.CHAR_CR}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_RT}${logtree.CHAR_HL}`
        + `4${logtree.CHAR_CR}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_RT}${logtree.CHAR_HL}`
        + `7${logtree.CHAR_CR}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_SL}${logtree.CHAR_HL}`
        + `8${logtree.CHAR_CR}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_SPACE}${logtree.CHAR_SPACE}${logtree.CHAR_SL}${logtree.CHAR_HL}`
        + `10${logtree.CHAR_CR}${logtree.CHAR_VL}${logtree.CHAR_SPACE}${logtree.CHAR_SL}${logtree.CHAR_HL}`
        + `9${logtree.CHAR_CR}${logtree.CHAR_SL}${logtree.CHAR_HL}`
        + `5${logtree.CHAR_CR}${logtree.CHAR_SPACE}${logtree.CHAR_SPACE}${logtree.CHAR_SL}${logtree.CHAR_HL}`
        + `6${logtree.CHAR_CR}`
    );
});
