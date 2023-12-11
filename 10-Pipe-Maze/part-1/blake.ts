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

console.log({ pipeCells })
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

const halfWayIndex = Math.ceil((pipeCells.length - 1) / 2)
const farthestCell = pipeCells[halfWayIndex]

console.log({ farthestCell, halfWayIndex })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')