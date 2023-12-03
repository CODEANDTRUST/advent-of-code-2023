export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const lines = input.split('\n')
// const lines = input.split('\n\n')

let sum = 0

let currentNumber = 0
let currentIsPartNumber = false

for (let i = 0; i < lines.length; i++) {
    charLoop: for (let j = 0; j < lines[i].length; j++) {
        let char = lines[i]?.[j]

        switch (char) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (currentNumber) {
                    currentNumber *= 10
                }
                currentNumber += Number(char)
                break;
            default:
                // console.log({ currentNumber, currentIsPartNumber })
                if (currentIsPartNumber) {
                    sum += currentNumber
                    // console.log("adding", currentNumber)
                }
                currentNumber = 0
                currentIsPartNumber = false

        }

        if (currentNumber && !currentIsPartNumber) {
            const neighbors = [
                [-1, -1],
                [0, -1],
                [1, -1],
                [-1, 0],
                [0, 0],
                [1, 0],
                [-1, 1],
                [0, 1],
                [1, 1],
            ]
            neighborLoop: for (let [x, y] of neighbors) {
                if (lines[i + x] && lines[i + x][j + y]) {
                    // console.log("looking at ", lines[i + x][j + y])
                    switch (lines[i + x][j + y]) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '.':
                        case undefined:
                            continue neighborLoop;
                        default:
                            currentIsPartNumber = true
                            continue charLoop;
                    }
                }
            }
        }
    }
    if (currentNumber && currentIsPartNumber) {
        sum += currentNumber
        currentNumber = 0
        currentIsPartNumber = false
    }
}

// console.log(lines)

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')

console.log("Answer: ", sum)