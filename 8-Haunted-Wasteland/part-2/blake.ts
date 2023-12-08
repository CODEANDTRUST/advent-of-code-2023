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

let pointerNodes: Node[] = []

// line 3 (index 2) is the first line of node data
for (let i = 2; i < lines.length; i++) {
    const line = lines[i]

    const node = parseNodeFromLine(line)

    if (node.name.endsWith('A')) {
        pointerNodes.push(node)
    }

    if (node.name === "AAA") {
        networkNodes.unshift(node)
    } else {
        networkNodes.push(node)
    }
}

let i = networkNodes.length - 1

let startNodes: Node[] = []

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

while (i >= 0) {

    let looseNode = networkNodes.pop() // end


    for (let node of networkNodes) {
        if (looseNode !== undefined) {
            attachNodes(node, looseNode)
        }
    }
    for (let node of pointerNodes) {
        if (looseNode !== undefined) {
            attachNodes(node, looseNode)
        }
    }

    if (looseNode?.name.endsWith("A")) {
        console.log(looseNode.name)
        startNodes.push(looseNode)
    }

    i--
}

console.log({ startNodes })

function countStepsToAllEnds(rootNode: Node) {
    let stepsTaken = 0
    let stepsNeeded = 0

    let pointer = rootNode

    // I just hope 1000 times through is enough
    for (let j = 0; j < 1000; j++) {
        for (let i = 0; i < rls.length; i++) {
            let direction = rls[i]
            if (direction === 'L') {
                pointer = pointer.left as Node
                stepsTaken++
            } else {
                pointer = pointer.right as Node
                stepsTaken++
            }
            if (pointer.name.endsWith('Z')) {
                // console.log("End found after", stepsTaken, 'steps')
                // if (stepsTaken === 2 * stepsNeeded) {
                //      return stepsNeeded
                // }
                // stepsNeeded = stepsTaken
                return stepsTaken
            }
        }
    }
    console.log("ERROR, irregular pattern")
    return stepsTaken
}

let stepsNeededArr: number[] = []
nodeLoop: for (let root of pointerNodes) {
    const stepsToEnd = countStepsToAllEnds(root)
    // console.log(stepsToEnd)

    for (let i = 0; i < stepsNeededArr.length; i++) {
        let s = stepsNeededArr[i]

        if ((stepsToEnd % s) === 0) {
            stepsNeededArr[i] = stepsToEnd
            continue nodeLoop
        }
    }
    stepsNeededArr.push(stepsToEnd)
}

console.log({ stepsNeededArr })

let product: bigint = 1n;
for (let n of stepsNeededArr) {
    product *= BigInt(n)
}

console.log({ answer: product })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
