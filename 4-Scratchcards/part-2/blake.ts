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


let cardMatches: number[] = []
for (let i = 0; i < winningValues.length; i++) {

    let matches = 0
    for (let winningValue of winningValues[i]) {
        for (let actualValue of actualValues[i]) {
            if (winningValue === actualValue) {
                matches++
            }
        }
    }

    cardMatches.push(matches)
}


function countCard(i: number) {
    if (i >= cardMatches.length) {
        return 0
    }

    let matches = cardMatches[i]
    let cardsCounted = 1

    for (let j = 1; j <= matches; j++) {
        cardsCounted += countCard(i + j)
    }

    // console.log("Returning card", { i, cardsCounted })
    return cardsCounted
}

let totalCardsRead = 0

for (let i = 0; i < cardMatches.length; i++) {
    totalCardsRead += countCard(i);
}

console.log({ totalCardsRead })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
