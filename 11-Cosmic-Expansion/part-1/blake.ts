export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

type Empty = '.'
const EMPTY: Empty = '.'

type Galaxy = '#'
const GALAXY: Galaxy = '#'

let outerSpace: ('.' | '#')[][] = input.split('\n').map(line => line.split('') as ('.' | '#')[])

let emptyRows: number[] = Array.from({ length: outerSpace.length }).map((_, i) => i)
let emptyColumns: number[] = Array.from({ length: outerSpace[0].length }).map((_, i) => i)

let galaxyLocations: [number, number][] = []

// find all galaxies and mark rows and columns as not empty
for (let i = 0; i < outerSpace.length; i++) {
    for (let j = 0; j < outerSpace[0].length; j++) {
        let char: Galaxy | Empty = outerSpace[i][j]
        if (char === GALAXY) {
            galaxyLocations.push([i, j])
            emptyRows = emptyRows.filter(n => n !== i)
            emptyColumns = emptyColumns.filter(n => n !== j)
        }
    }
}

// console.log({ emptyRows, emptyColumns, galaxyLocations })

// "expand" the universe by adjusting each galaxy a little bit
for (let i = 0; i < galaxyLocations.length; i++) {
    let expansionRate = 0
    for (let emptyRow of emptyRows) {
        let [row, _] = galaxyLocations[i]

        if (row > emptyRow) {
            expansionRate++
        }
    }
    galaxyLocations[i][0] += expansionRate
}
for (let i = 0; i < galaxyLocations.length; i++) {
    let expansionRate = 0
    for (let emptyColumn of emptyColumns) {
        let [_, column] = galaxyLocations[i]

        if (column > emptyColumn) {
            expansionRate++
        }
    }
    galaxyLocations[i][1] += expansionRate
}

// console.log({ expandedGalaxyLocations: galaxyLocations })

// the Manhattan Distance between two points if found by 
// traveling in paths that are parallel to the y axis and x axis
// its basically how many 'blocks' away two places are in new york
function manhattanDistance({ x1, y1, x2, y2 }: { x1: number, y1: number, x2: number, y2: number }): number {
    let distance = 0;

    distance += Math.abs(x1 - x2)
    distance += Math.abs(y1 - y2)

    return distance
}

let sum = 0

// find the distance from each galaxy to each other galaxy
for (let i = 0; i < galaxyLocations.length - 1; i++) {
    for (let j = i + 1; j < galaxyLocations.length; j++) {
        let [y1, x1] = galaxyLocations[i]
        let [y2, x2] = galaxyLocations[j]

        let distance = manhattanDistance({ x1, y1, x2, y2 })
        // console.log({ i: i + 1, j: j + 1, distance })

        sum += distance
    }
}

console.log({ sum })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')