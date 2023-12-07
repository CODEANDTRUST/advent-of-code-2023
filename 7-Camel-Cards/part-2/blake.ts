export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const valueMap = {
    'A': 13,
    'K': 12,
    'Q': 11,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    'J': 1,
}

const lines = input.split('\n')

// console.log(lines.map(line => line.trim().split(' ')))

// score is score of the hand  * 100 + high card value
function getHandScore(hand: string): number {

    let score = 0;

    for (let i = 0; i < hand.length; i++) {
        // console.log(Math.pow(100, hand.length - i - 1))
        score += valueMap[hand[i]] * (Math.pow(100, hand.length - i - 1))
    }

    let handPower = 0

    //             [ card,  count ]
    let seenCards: [string, number][] = []

    let wildCards = 0
    handLoop: for (let handCard of hand) {
        if (handCard === 'J') {
            wildCards++
            continue;
        }
        for (let i = 0; i < seenCards.length; i++) {
            const [seenCard] = seenCards[i]
            if (handCard === seenCard) {
                seenCards[i][1]++
                continue handLoop
            }
        }
        seenCards.push([handCard, 1])
    }

    if (wildCards === 5) {
        seenCards.push(["J", 5])
    } else {
        // find most seen and add 1
        let highIndex = 0
        for (let i = 0; i < seenCards.length; i++) {
            let [_card, count] = seenCards[i]
            if (count > seenCards[highIndex][1]) {
                highIndex = i
            }
        }

        seenCards[highIndex][1] += wildCards
    }

    for (let [_card, count] of seenCards) {
        count > 1 && (handPower += Math.pow(3, count - 1))
    }

    score += handPower * Math.pow(100, hand.length)
    // console.log({ hand, handPower, score })

    return score
}

// 3^(seen - 1)
// 1 aa  - 1 
// 2 aabb - 1+1

// 3 aaa - 3 
// 4 aaabb - 3 + 1

// 5 aaaa - 6

// 7 aaaaa - 9

let hands: { score: number, bid: number, hand: string }[] = []

function insert(newHand: { score: number, bid: number, hand: string }) {

    if (hands.length === 0) {
        hands.push(newHand)
        return
    }
    for (let i = 0; i < hands.length; i++) {
        if (newHand.score > hands[i].score) {
            hands.splice(i, 0, newHand)
            return
        }
    }
    hands.push(newHand)
}

for (let line of lines) {
    const [hand, bid] = line.trim().split(' ')


    const score = getHandScore(hand)

    insert({ hand, score, bid: Number(bid) })

    // console.log({ hand, bid, score })
}

let sum = 0;

for (let i = 0; i < hands.length; i++) {
    console.log({ hand: hands[i].hand, bid: hands[i].bid, rank: hands.length - i, winnings: hands[i].bid * (hands.length - i) })
    // console.log({ hand: hands[i].hand, bid: hands[i].bid, rank: hands.length - i, winnings: hands[i].bid * (hands.length - i) })
    sum += hands[i].bid * (hands.length - i)
}

// console.log("sorted:", hands)
console.log({ sum })

const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
