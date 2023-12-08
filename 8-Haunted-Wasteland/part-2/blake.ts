export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const lines = input.split('\n')

const rls = lines[0]

interface Node {
    name: string

    left?: Node
    right?: Node
}

type NetworkNodes = Node[]

let networkNodes: NetworkNodes = []

function parseNodeFromLine(line: string): Node {
    const [name, leafs] = line.split(' = ')
    const [left, right] = leafs.replace('(', '').replace(')', '').replace(' ', '').split(',')
    return { name, left: { name: left }, right: { name: right } }
}

let startNodes: Node[] = []

// line 3 (index 2) is the first line of node data
for (let i = 2; i < lines.length; i++) {
    const line = lines[i]

    const node = parseNodeFromLine(line)

    if (node.name.endsWith('A')) {
        startNodes.push(node)
    }

    networkNodes.push(node)
}

// returns true if nodes were attached
function attachNodes(rootNode: Node, otherNode: Node): boolean {

    let attachments = 0

    if (rootNode.left?.name === otherNode?.name) {
        rootNode.left = otherNode
        attachments++
    }
    if (rootNode.right?.name === otherNode?.name) {
        rootNode.right = otherNode
        attachments++
    }
    if (otherNode?.left?.name === rootNode.name) {
        otherNode.left = rootNode
        attachments++
    }
    if (otherNode?.right?.name === rootNode.name) {
        otherNode.right = rootNode
        attachments++
    }

    return attachments > 0
}

while (networkNodes.length > 0) {

    let looseNode = networkNodes.pop() // end


    for (let node of networkNodes) {
        if (looseNode !== undefined) {
            attachNodes(node, looseNode)
        }
    }
    for (let node of startNodes) {
        if (looseNode !== undefined) {
            attachNodes(node, looseNode)
        }
    }

}

// console.log({ startNodes })

// find if any of the start nodes share the same tree

let foundNames: string[] = []

function checkNode(node: Node) {
    if (!foundNames.includes(node.name)) {
        foundNames.push(node.name)
        node.left && checkNode(node.left)
        node.right && checkNode(node.right)
    }
}

const MAX_STEPS = 10000000
// networks contain 1 start and 1 end
// following instructions will always take the same number of steps 
// to land on an end position
function countStepsToEnds(root: Node): number {

    let currentNode = root
    let stepsTaken = 0

    while (true) {

        // follow the instructions (over and over)
        for (let i = 0; i < rls.length; i++) {
            let direction = rls[i]

            if (direction === 'L') {
                currentNode.left && (currentNode = currentNode.left)
            } else if (direction === 'R') {
                currentNode.right && (currentNode = currentNode.right)
            } else {
                console.log("BAD INPUT:", direction)
            }
            stepsTaken++

            if (currentNode.name.endsWith('Z')) {
                return stepsTaken
            }
        }

        if (stepsTaken >= MAX_STEPS) {
            break
        }
    }

    return stepsTaken
}

let minSteps: number[] = []

for (let root of startNodes) {
    foundNames = []
    checkNode(root) // find names in network

    minSteps.push(countStepsToEnds(root))
    // console.log({
    //     rootName: root.name,
    //     names: foundNames.length,
    //     namesWithA: foundNames.filter(name => name.endsWith('A')),
    //     namesWithZ: foundNames.filter(name => name.endsWith('Z')),
    // })
}

console.log({ minSteps })

// confirmed the steps needed are not factors of each other
// for (let s of minSteps) {
//     for (let s2 of minSteps) {
//         if (s === s2) {
//             continue
//         }
//         if (s % s2 === 0) {
//             console.log("found one", { s, s2 })
//         } else if (s2 % s === 0) {
//             console.log("found one", { s, s2 })
//         }
//     }
// }

// confirming the values are not bad
// let p = 1n
// for (let i = 0; i < minSteps.length; i++) {
//     let n = minSteps[i]
//     p *= BigInt(n)
//     for (let j = i + 1; j < minSteps.length; j++) {
//         let n2 = minSteps[j]
//         if (p % BigInt(n2) === 0n) {
//             console.log("WTF", n2)
//         }
//     }
// }
// console.log({ p })

let lcm = 1

function getLcm(a, b): number {

    let min = Math.min(a, b)
    let max = a + b - min

    let i = 1;
    while (true) {
        if ((max * i) % min === 0) {
            return max * i
        }

        if (++i > 1000000) {
            break
        }
    }
    console.log("Something is wrong")
    return 0
}

for (let n of minSteps) {
    lcm = getLcm(n, lcm)
}

console.log({ lcm })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
