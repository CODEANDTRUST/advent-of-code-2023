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

console.log({ startNodes })

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
//
function countStepsToEnds(root: Node): number[] {
    let stepsToEnd: number[] = []

    let currentNode = root
    let stepsTaken = 0

    while (true) {

        // follow the instructions (over and over)
        for (let i = 0; i < rls.length; i++) {
            let direction = rls[i]

            if (direction === 'L') {
                currentNode.left && (currentNode = currentNode.left)
            } else {
                currentNode.right && (currentNode = currentNode.right)
            }
            stepsTaken++

            if (currentNode.name.endsWith('Z')) {
                stepsToEnd.push(stepsTaken)
                if (stepsTaken % stepsToEnd[0] > 0) {
                    console.log({ irregular: stepsTaken })
                }
            }
        }

        // if you finished walking through the instructions, find out if you end up at the start again
        if (currentNode.name === root.name) {
            break;
        }
        if (stepsTaken >= MAX_STEPS) {
            break
        }
    }

    return stepsToEnd
}

for (let root of startNodes) {
    foundNames = []
    checkNode(root) // find names in network

    const ns = countStepsToEnds(root)
    console.log({ ns })
    // console.log({
    //     rootName: root.name,
    //     names: foundNames.length,
    //     namesWithA: foundNames.filter(name => name.endsWith('A')),
    //     namesWithZ: foundNames.filter(name => name.endsWith('Z')),
    // })
}

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
