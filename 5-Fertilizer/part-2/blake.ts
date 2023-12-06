export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()


const sections = input.split('\n\n')

// parse input into 3d number array

let maps: number[][][] = []
for (let section of sections) {
    // console.log(section)
    let strArr = section.split(":")[1].trim().split("\n")
    let numbers: number[][] = []
    for (let arr of strArr) {
        numbers.push(arr.split(" ").map(Number))
    }
    maps.push(numbers)
}


const seeds = maps.splice(0, 1)[0][0]

// console.log({ numbers: maps })
// console.log({ seeds })

let seedInputRanges: [number, number][] = []

// get seed input ranges
for (let i = 0; i < seeds.length; i += 2) {
    let domainStart = seeds[i]
    let domainSize = seeds[i + 1]
    let domainEnd = domainStart + domainSize - 1
    // console.log([domainStart, domainEnd])
    seedInputRanges.push([domainStart, domainEnd])
}

// sort seed ranges
function sort2DTuples(arr: [number, number][]) {

    // bubble sort lmao
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            let a = arr[j][0]
            let b = arr[j + 1][0]
            if (a > b) {
                // swap them boys
                let c = arr[j][1]
                let d = arr[j + 1][1]

                arr[j][0] = b
                arr[j + 1][0] = a

                arr[j][1] = d
                arr[j + 1][1] = c
            }
        }
    }

    for (let i = 0; i < arr.length - 1; i++) {
        let [a, b] = arr[i]
        let [c, d] = arr[i + 1]

        if (a === c && b === d) {
            arr.splice(--i + 1, 1)
        }

    }
}

sort2DTuples(seedInputRanges)
// console.log({ seedInputRanges })

let inputs = seedInputRanges
let outputs: [number, number][] = []

for (let i = 0; i < maps.length; i++) {
    console.log()
    // look at one map,
    // if map and an input range overlap, adjust
    outputs = []

    for (let j = 0; j < inputs.length; j++) {
        let [seedMin, seedMax] = inputs[j]

        let initialOutputLength = outputs.length
        console.log("Seed inputs", { seedMin, seedMax, initialOutputLength })
        for (let [rangeMin, domainMin, size] of maps[i]) {

            const domainMax = domainMin + size - 1
            const offset = rangeMin - domainMin // input + range = output

            if (seedMax < domainMin || seedMin > domainMax) {
                // don't look at this one - ranges do not intersect
                continue
            } else {
                // ranges do intersect
                // console.log("range intersect", { seedMin, seedMax }, { domainMin, domainMax })

                if (seedMin < domainMin) {
                    console.log("Pushing new low input range", { seedMin, max: domainMin - 1 })
                    inputs.push([seedMin, domainMin - 1])
                }
                outputs.push([Math.max(seedMin, domainMin) + offset, Math.min(seedMax, domainMax) + offset])
                if (seedMax > domainMax) {
                    console.log("Pushing new upper", { min: domainMax + 1, seedMax })
                    inputs.push([domainMax + 1, seedMax])
                }
            }
        }

        console.log({ initialOutputLength, length: outputs.length })

        if (initialOutputLength === outputs.length) {
            console.log("PUSHING default", { seedMin, seedMax })
            outputs.push([seedMin, seedMax]) // ranges did not fall into 
        }
    }

    sort2DTuples(outputs)

    // console.log({ inputs })
    inputs = outputs
    // console.log({ outputs })
}

console.log({ outputs })
console.log("lowest ouptut", outputs[0][0])


const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
