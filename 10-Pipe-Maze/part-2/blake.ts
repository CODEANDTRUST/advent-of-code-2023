export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const grid: string[] = input.split('\n')

// console.log(grid)

/**
 *   j +
 * i            i row       y
 * +            j column    x
 */

// almost magically, if you put all the looping pipe cells into an array and divide the length of 
// that array by 2, the cell in that index is the farthest away. So thats what I'm gonna do

let pipeCells: [number, number][] = []

for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        // look at every cell until you find the start of the pipe
        let cell = grid[i][j]
        if (cell === 'S') {
            console.log("Start at ", [i, j])
            pipeCells.push([i, j])
        }
    }
}

type Direction = 'north' | 'east' | 'south' | 'west'

type GridChar = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.'

const charDirectionMap: Record<GridChar, Direction[]> = {
    '|': ['north', 'south'],
    '-': ['east', 'west'],
    'L': ['north', 'east'],
    'J': ['north', 'west'],
    '7': ['south', 'west'],
    'F': ['east', 'south'],
    '.': [],
}

// from the start, find a neighbor that connects to it

const startCell = pipeCells[0]

let comingFrom: Direction

function opposite(direction: Direction): Direction {
    if (direction === 'north') {
        return 'south'
    } else if (direction === 'south') {
        return 'north'
    } else if (direction === 'east') {
        return 'west'
    } else { // initial direction was 'west'
        return 'east'
    }

}

const neighborIndices = [
    [-1, 0], // north
    [0, 1], // east
    [1, 0], // south
    [0, -1], // west
]

// find first connection and start searching
for (let k = 0; k < neighborIndices.length; k++) {
    let [ni, nj] = neighborIndices[k]

    let i = startCell[0] + ni
    let j = startCell[1] + nj

    // prevent out of bounds
    if (!grid[i] || !grid[i][j]) {
        continue
    }

    if (grid[i][j]) {
        let char = grid[i][j] as GridChar
        const neighborDirections = charDirectionMap[char]
        if (k === 0 && neighborDirections.includes('south')) {
            // north neighbor connects south
            pipeCells.push([i, j])
            comingFrom = 'south'
            break;
        } else if (k === 1 && neighborDirections.includes('west')) {
            // east neighbor connects west 
            pipeCells.push([i, j])
            comingFrom = 'west'
            break;
        } else if (k === 2 && neighborDirections.includes('north')) {
            // south neighbor connects north
            pipeCells.push([i, j])
            comingFrom = 'north'
            break;
        } else if (k === 3 && neighborDirections.includes('east')) {
            // west neighbor connects east
            pipeCells.push([i, j])
            comingFrom = 'east'
            break;
        }
    }
}

// console.log({ pipeCells })
let currentCell = pipeCells[1]

while (currentCell[0] !== startCell[0] || currentCell[1] !== startCell[1]) {
    const [i, j] = currentCell
    // console.log({ i, j })

    const char = grid[i][j] as (GridChar | 'S')
    if (char !== 'S') {
        const connectionDirection = charDirectionMap[char].filter(d => d !== comingFrom)[0]
        let nextNeighbor: [number, number] = [i, j]
        if (connectionDirection === 'north') {
            nextNeighbor[0]--
        } else if (connectionDirection === 'south') {
            nextNeighbor[0]++
        } else if (connectionDirection === 'east') {
            nextNeighbor[1]++
        } else if (connectionDirection === 'west') {
            nextNeighbor[1]--
        }

        pipeCells.push(nextNeighbor)
        currentCell = nextNeighbor
        comingFrom = opposite(connectionDirection)
    }
}

// due to the way the loops work, the loop is never crossing
// and it always contained in the grid
// it may touch the edge of the grid, but the algorith
// will account for that
// start in "Outside" mode
// if you find a ground cell, +1 outside cells
// if you find a pipe cell in the main loop, switch to "Inside" mode
// if you find a ground cell, +1 incide cells
// if you find a pipe cell in the main loop, switch to "Outside" mode


// make a clean version of the output where all pipe chars that are not part
// of the main loop are set to ground tiles
// first create a grid of all '.' (ground tiles)
// then mark all main pipe chars 
// and done


let fillerChars: string = ''
for (let i = 0; i < grid[0].length; i++) {
    fillerChars += '.'
}

let cleanGrid: string[] = Array.from<string>({ length: grid.length }).fill(fillerChars)

for (let [i, j] of pipeCells) {
    const char = grid[i][j]

    let replacement = cleanGrid[i]
    replacement = replacement.slice(0, j) + char + replacement.slice(j + 1)
    cleanGrid[i] = replacement
}

console.log(cleanGrid)

let sum = 0

let recentCornerChar: GridChar = '.'

let output: string[] = []

let mode = 0  // 0 - Outside | 1 - Inside
for (let i = 0; i < cleanGrid.length; i++) {
    output.push('')
    mode = 0
    for (let j = 0; j < cleanGrid[i].length; j++) {
        let char: GridChar = cleanGrid[i][j] as GridChar
        if ((char as string) === 'S') {
            char = "F"
        }

        output[i] += char === '.' ? (mode === 0 ? 'O' : 'I') : 'P'

        if (char === '.') {
            sum += mode // 0 if outside mode | 1 if inside mode
        } else if (char === '|') {
            mode = (mode + 1) % 2
        } else if (char === '-') {
            continue
        } else if (char === 'L') {
            recentCornerChar = 'L'
            continue
        } else if (char === 'F') {
            recentCornerChar = 'F'
            continue
        } else if (char === '7') {
            if (recentCornerChar === 'F') {
                continue
            } else if (recentCornerChar === 'L') {
                mode = (mode + 1) % 2
            }
            recentCornerChar = '7'
        } else if (char === 'J') {
            if (recentCornerChar === 'L') {
                continue
            } else if (recentCornerChar === 'F') {
                mode = (mode + 1) % 2
            }
            recentCornerChar = 'J'
        }
    }
}

console.log()
console.log({ output, sum, pipes: pipeCells.length })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')