export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const lines = input.split('\n')

const time = Number(lines[0].split(":")[1].replace(/\s/g, ''))
const distance = Number(lines[1].split(":")[1].replace(/\s/g, ''))

console.log({ time, distance })


let raceTime_ms = time
let distanceToBeat_mm = distance

let speedIncreasePerTimeHeld_mm_ms = 1

// quadratic equation: x = (-b +/- sqrt((b ** 2) - 4ac)) - 2a
// or x1 = (-b / 2a) + sqrt((b ** 2) - 4ac)
// or x2 = (-b / 2a) - sqrt((b ** 2) - 4ac)

let a = speedIncreasePerTimeHeld_mm_ms
let b = -raceTime_ms
let c = distanceToBeat_mm

let discriminant = Math.pow(b, 2) - (4 * a * c)

if (discriminant >= 0) {
    var x1 = (-b - Math.sqrt(discriminant)) / (2 * a)
    var x2 = (-b + Math.sqrt(discriminant)) / (2 * a)
} else {
    console.log("imaginary roots")
    // error
}

if (parseInt(x1) === x1) {
    x1++ // gotta win
}
if (parseInt(x2) === x2) {
    x2-- // gotta win
}

const minHoldTime_ms = Math.ceil(x1)
const maxHoldTime_ms = Math.floor(x2)


console.log({ min: minHoldTime_ms, max: maxHoldTime_ms })
console.log("# possible wins", maxHoldTime_ms - minHoldTime_ms + 1)


const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')
