export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

// 5 skips 'Card '
const lineStartBuffer: number = 5

enum MODE {
    startLine,
    winningValues,
    actualValues
}

let mode: MODE = MODE.startLine

let winningValues: string[][] = []
let actualValues: string[][] = []

let lineNumber: number = 1

let j: number = 0 // reusable pointer

for (let i = lineStartBuffer; i < input.length; i++) {

    const char = input.charAt(i)

    if (mode === MODE.startLine) {
        // find : char,
        if (char === ':') {
            i++
            mode = MODE.winningValues
            winningValues.push([])
        }
    } else if (mode === MODE.winningValues) {
        if (char === ' ') {
            const nextChar = input[i + 1]
            if (nextChar === '|') {
                continue
            } else if (nextChar == ' ') {
                // do nothing
                continue
            } else {
                if (winningValues[lineNumber - 1][j]) {
                    j++
                }
            }
        } else if (char === '|') {
            mode = MODE.actualValues
            actualValues.push([])
            j = 0;
        } else {
            // char is a digit
            if (winningValues[lineNumber - 1][j]) {
                winningValues[lineNumber - 1][j] += char
            } else {
                winningValues[lineNumber - 1][j] = char
            }
        }
    } else if (mode === MODE.actualValues) {
        if (char === ' ') {
            const nextChar = input[i + 1]
            if (nextChar === '|') {
                continue
            } else if (nextChar == ' ') {
                // do nothing
                continue
            } else {
                if (actualValues[lineNumber - 1][j]) {
                    j++
                }
            }
        } else if (char === '\n') {
            mode = MODE.startLine
            lineNumber++
            j = 0
        } else {
            // char is a digit
            if (actualValues[lineNumber - 1][j]) {
                actualValues[lineNumber - 1][j] += char
            } else {
                actualValues[lineNumber - 1][j] = char
            }
        }
    }

    // parse numbers until you find | character
    // parse numbers until the end
}


let scores: number[] = []
for (let i = 0; i < winningValues.length; i++) {

    let matches = 0
    for (let winningValue of winningValues[i]) {
        for (let actualValue of actualValues[i]) {
            if (winningValue === actualValue) {
                matches++
            }
        }
    }

    scores.push(!matches ? matches : Math.pow(2, matches - 1))
}

let sum = 0
for (let score of scores) {
    sum += score
}

console.log({ winningValues, actualValues, scores, sum })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
