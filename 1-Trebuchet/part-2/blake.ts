export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const e = 101
const f = 102
const g = 103
const h = 104
const i = 105
const n = 110
const o = 111
const r = 114
const s = 115
const t = 116
const u = 117
const v = 118
const w = 119
const x = 120

const charCode0 = 48
const charCode9 = 57
const breakLineCode = 10

const charCodeOffset = charCode0

let firstNumber: number = 0;
let recentNumber: number = 0;
let sum: number = 0;

function addValues() {
    sum += firstNumber * 10
    sum += recentNumber

    // console.log(firstNumber, recentNumber)
}

function resetNumbers() {
    firstNumber = 0;
    recentNumber = 0;
}

for (let index = 0; index < input.length; index++) {
    let char: number = input.charCodeAt(index)

    // console.log(input[index], char)

    if (char === breakLineCode) {
        addValues()
        resetNumbers()
    }

    let foundNumber = 0;

    // if its a number
    if (char >= charCode0 && char <= charCode9) {
        if (!firstNumber) {
            firstNumber = char - charCodeOffset
        }
        recentNumber = char - charCodeOffset
    }
    // else check for first char, then check whole word
    else if (char === o) {
        // find 'ne'
        if (input.charCodeAt(index + 1) === n && input.charCodeAt(index + 2) === e) {
            foundNumber = 1
        }
    } else if (char === t) {
        // find 'wo' or 'hree'
        if (input.charCodeAt(index + 1) === w && input.charCodeAt(index + 2) === o) {
            foundNumber = 2
        } else if (input.charCodeAt(index + 1) === h && input.charCodeAt(index + 2) === r && input.charCodeAt(index + 3) === e && input.charCodeAt(index + 4) === e) {
            foundNumber = 3
        }
    } else if (char === f) {
        // find 'our' or 'ive'
        if (input.charCodeAt(index + 1) === o && input.charCodeAt(index + 2) === u && input.charCodeAt(index + 3) === r) {
            foundNumber = 4
        } else if (input.charCodeAt(index + 1) === i && input.charCodeAt(index + 2) === v && input.charCodeAt(index + 3) === e) {
            foundNumber = 5
        }
    } else if (char === s) {
        // find 'ix' or 'even'
        if (input.charCodeAt(index + 1) === i && input.charCodeAt(index + 2) === x) {
            foundNumber = 6
        } else if (input.charCodeAt(index + 1) === e && input.charCodeAt(index + 2) === v && input.charCodeAt(index + 3) === e && input.charCodeAt(index + 4) === n) {
            foundNumber = 7
        }
    } else if (char === e) {
        // find 'ight'
        if (input.charCodeAt(index + 1) === i && input.charCodeAt(index + 2) === g && input.charCodeAt(index + 3) === h && input.charCodeAt(index + 4) === t) {
            foundNumber = 8
        }
    } else if (char === n) {
        // find 'ine'
        if (input.charCodeAt(index + 1) === i && input.charCodeAt(index + 2) === n && input.charCodeAt(index + 3) === e) {
            foundNumber = 9
        }
    }

    if (foundNumber) {
        if (!firstNumber) {
            firstNumber = foundNumber
        }
        recentNumber = foundNumber
    }
}

// add last line
addValues()

const t3 = performance.now()

console.log(sum)

console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t1, 'ms')