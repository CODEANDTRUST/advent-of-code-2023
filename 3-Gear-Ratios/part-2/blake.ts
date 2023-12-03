export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const lines = input.split('\n')
// const lines = input.split('\n\n')

let sum = 0;

let gearPositions: [number, number][] = []

for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === '*') {
            gearPositions.push([i, j])
        }
    }
}

let neighborIndeces = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
]

for (let [i, j] of gearPositions) {
    let partNumberStarts: [number, number][] = []

    // look at all neighbors
    neighborLoop: for (let [a, b] of neighborIndeces) {
        const neighborChar = lines[i + a]?.[j + b]

        if (!isNaN(Number(neighborChar))) {
            // its a number
            // look left to find the number start
            for (let k = j + b - 1; k >= 0; k--) {
                const c = lines[i + a]?.[k]
                if (!c || isNaN(Number(c))) {
                    for (let [l, m] of partNumberStarts) {
                        if (l === i + a && m === k + 1) {
                            continue neighborLoop
                        }
                    }
                    partNumberStarts.push([i + a, k + 1])
                    continue neighborLoop
                }
            }
            for (let [l, m] of partNumberStarts) {
                if (l === i + a && m === 0) {
                    continue neighborLoop
                }
            }
            partNumberStarts.push([i + a, 0])
            continue neighborLoop
        }

    }

    // find exactly 2 neighbors
    // if 2, * and sum
    if (partNumberStarts.length === 2) {

        let gearRatio = 1
        for (let [i, j] of partNumberStarts) {
            let gearValue = parseInt(lines[i].slice(j))
            // if (isNaN(gearValue)) {
            //     console.log("made an error")
            //     console.log(lines[i])
            //     console.log(lines[i].slice(j))
            // }
            // console.log("parsed", gearValue)
            gearRatio *= gearValue
        }
        sum += gearRatio
    }
    partNumberStarts = []
}



const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')

console.log("Answer: ", sum)