export { };

// Run with Deno! : Deno run --allow-read blake.ts

let input: string = await Deno.readTextFile("./input.txt");

const charCode0 = 48
const charCode9 = 57
const breakLineCode = 10

const charCodeOffset = charCode0


let firstNumberCode: number = 0
let recentNumberCode: number = 0
let sum: number = 0

for (let i = 0; i < input.length; i++) {
    // find first number
    // track recent number
    // go until end of line
    // use most recent number
    // add first and recent
    // add to sum
    // reset and do next line

    let charCode: number = input.charCodeAt(i)
    // console.log(String.fromCharCode(charCode), charCode)

    if (charCode === breakLineCode) {
        // add first and recent
        sum += ((firstNumberCode) - charCodeOffset) * 10
        sum += (recentNumberCode) - charCodeOffset

        // console.log((((firstNumberCode) - charCodeOffset) * 10) + (recentNumberCode) - charCodeOffset)

        // then reset
        firstNumberCode = 0
        recentNumberCode = 0
    }

    // if its a number
    if (charCode >= charCode0 && charCode <= charCode9) {
        if (!firstNumberCode) {
            firstNumberCode = charCode
        }
        recentNumberCode = charCode

        // console.log(String.fromCharCode(charCode), charCode)
        // console.log(String.fromCharCode(firstNumberCode), firstNumberCode)
        // console.log(String.fromCharCode(recentNumberCode), recentNumberCode)
    }

}

// add after last line

sum += ((firstNumberCode) - charCodeOffset) * 10
sum += (recentNumberCode) - charCodeOffset


console.log(sum)