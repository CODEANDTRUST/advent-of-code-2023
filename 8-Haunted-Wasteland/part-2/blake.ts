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

    if (looseNode?.name.endsWith("A")) {
        startNodes.push(looseNode)
    }

    i--
}

console.log({ startNodes })




const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
