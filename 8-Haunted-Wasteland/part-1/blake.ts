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

// line 3 (index 2) is the first line of node data
for (let i = 2; i < lines.length; i++) {
    const line = lines[i]

    const node = parseNodeFromLine(line)

    if (node.name === "AAA") {
        networkNodes.unshift(node)
    } else {
        networkNodes.push(node)
    }
}

const destinationName = 'ZZZ'
let i = networkNodes.length - 1

while (i > 0) {

    let looseNode = networkNodes.pop() // end


    for (let node of networkNodes) {
        if (node.left?.name === looseNode?.name) {
            node.left = looseNode
        }
        if (node.right?.name === looseNode?.name) {
            node.right = looseNode
        }
        if (looseNode?.left?.name === node.name) {
            looseNode.left = node
        }
        if (looseNode?.right?.name === node.name) {
            looseNode.right = node
        }
    }

    i--
}


let stepsTaken = 0;
const MAX_STEPS_ERROR_HANDLER = 1000000000

let currentNode: Node = networkNodes[0]

console.log({ networkNodes })
outerLoop: while (true) {

    for (let i = 0; i < rls.length; i++) {

        let direction = rls[i]

        if (direction === 'L') {
            if (currentNode.left) {
                currentNode = currentNode.left
            } else {
                console.log("ERROR node does not have a left child", currentNode)
                break outerLoop
            }
        } else if (direction === 'R') {
            if (currentNode.right) {
                currentNode = currentNode.right
            } else {
                console.log("ERROR node does not have a right child", currentNode)
                break outerLoop
            }
        } else {
            console.log("ERROR reading LR directions", rls[i])
            break outerLoop
        }
        stepsTaken++

        if (currentNode.name === destinationName) {
            console.log("Reached destination", { destination: { currentNode } })
            break outerLoop
        }

        if (stepsTaken >= MAX_STEPS_ERROR_HANDLER) {

            break outerLoop;
        }
    }
}

console.log(stepsTaken)

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
