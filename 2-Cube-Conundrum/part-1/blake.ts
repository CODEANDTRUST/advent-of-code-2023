export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

// read a line, parse the game id
// look at a dice color and the number
// if the number excedes the max allowed, throw out this game
// if the game was playable, add the id to the running sum

let sum: number = 0
let gameId: number = 0;

const maxRed = 12
const maxGreen = 13
const maxBlue = 14

let recentNumber = 0

for (let i = 0; i < input.length; i++) {

    const char = input.charAt(i)
    // i will act as a pointer for the end of the current token
    // i will be EXCLUSIVE for token positions
    // tokenStartIndex will be INCLUSIVE

    switch (char) {
        // case ' ':
        // we don't actually care about spaces
        // weird 
        // break;
        case '\n':
            // console.log("end of line", { gameId, sum })
            sum += gameId
            i += 5
            break;
        case ':':
            // end game id
            gameId = recentNumber
            recentNumber = 0
            // console.log({ gameId })
            i++ // this moves the start index to the right spot and skips the next iteration
            break;
        case ';':
            // console.log("-")
            // end round
            // don't actually care much about this either since algorithm is O(n) already
            i++
            break;
        case ',':
            // end color name
            i++
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            recentNumber *= 10
            recentNumber += +char
            break;
        case 'r':
            // console.log("red", recentNumber)
            if (recentNumber > maxRed) {
                // console.log("impossible game - red", { recentNumber, maxRed, gameId })
                gameId = 0
            }
            recentNumber = 0
            i += 2 // 'ed'
            break;
        case 'g':
            // console.log("green", recentNumber)
            if (recentNumber > maxGreen) {
                // console.log("impossible game - green", { recentNumber, maxGreen, gameId })
                gameId = 0
            }
            recentNumber = 0
            i += 4 // 'reen'
            break;
        case 'b':
            // console.log("blue", recentNumber)
            if (recentNumber > maxBlue) {
                // console.log("impossible game - blue", { recentNumber, maxBlue, gameId })
                gameId = 0
            }
            recentNumber = 0
            i += 3 // 'lue'
            break;
        case 'G':
            i += 4// 'ame '
        default:
            // found a letter
            break;
    }


}

// lastly add the last value
sum += gameId

const t3 = performance.now()
console.log({ sum })

console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')