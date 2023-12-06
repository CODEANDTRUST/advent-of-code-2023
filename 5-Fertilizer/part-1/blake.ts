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

console.log({ numbers: maps })
console.log({ seeds })

let locations: number[] = []

for (let seed of seeds) {
    let n = seed // running mapped value
    mapLoop: for (let i = 0; i < maps.length; i++) {
        let map = maps[i]
        for (let [rangeStart, domainStart, rangeLength] of map) {
            const domainEnd = domainStart + rangeLength - 1
            const rangeEnd = rangeStart + rangeLength - 1
            const offset = domainStart - rangeStart

            // console.log("Domain", domainStart, domainEnd)
            // console.log("Range", rangeStart, rangeEnd)
            // console.log("Offset", offset)
            if (n >= domainStart && n <= domainEnd) {
                // console.log(seed, ' falls between ', domainStart, ' and ', domainEnd)
                // console.log('seed', seed, '-', n, 'maps to', n - offset, 'in map', i)
                n -= offset
                continue mapLoop
            }
        }
        // console.log('seed', seed, '-', n, 'is still', n, 'in map', i)
    }
    locations.push(n)
}

let lowest = Infinity;

for (let location of locations) {
    if (location < lowest) {
        lowest = location
    }
}

console.log("Closest location:", lowest)

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
