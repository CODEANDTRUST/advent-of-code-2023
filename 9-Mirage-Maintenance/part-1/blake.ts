export { };

// Run with Deno! : Deno run --allow-read blake.ts

const t1 = performance.now()
let input: string = await Deno.readTextFile("./input.txt");
const t2 = performance.now()

const lines = input.split('\n').map(line => line.split(' ').map(Number))

type Matrix = number[][]

function sumOfArray(arr: number[]): number {
    let sum = 0
    for (let n of arr) {
        sum += n
    }
    return sum
}

/**
 * transpose of a matrix is where you flip the values across the diagonal
 *  
 *  1  4  8                     1  3 -1
 *  3 -2  2   -> transpose ->   4 -2  0
 * -1  0  7                     8  2  7
 * 
 * @param matrix 
 * @returns 
 */
function transposeOfMatrix(matrix: Matrix): Matrix {
    let transpose: Matrix = []

    if (matrix.length === 0) {
        return matrix
    }

    const matrixRows = matrix.length
    const matrixColumns = matrix[0].length

    for (let j = 0; j < matrixColumns; j++) {
        for (let i = 0; i < matrixRows; i++) {
            if (transpose[i] === undefined) {
                transpose.push([])
            }
            transpose[i][j] = matrix[i][j]
        }
    }

    return transpose
}

function multiplyMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
    const product: Matrix = [];
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;

    if (colsA !== rowsB) {
        console.log("Cannot multiply matrices: Invalid dimensions", rowsA, colsA, rowsB, colsB);
        return [];
    }

    for (let i = 0; i < rowsA; i++) {
        product.push([])
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            for (let k = 0; k < colsA; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            product[i][j] = sum;
        }
    }
    return product;
}

// Function to perform LU decomposition of a matrix
function luDecomposition(matrix: Matrix) {
    const n = matrix.length;
    const L: Matrix = [];
    const U: Matrix = [];

    for (let i = 0; i < n; i++) {
        L[i] = [];
        U[i] = [];
        for (let j = 0; j < n; j++) {
            L[i][j] = 0;
            U[i][j] = 0;
        }
    }

    for (let i = 0; i < n; i++) {
        L[i][i] = 1;
        for (let j = i; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < i; k++) {
                sum += L[i][k] * U[k][j];
            }
            U[i][j] = matrix[i][j] - sum;
        }
        for (let j = i + 1; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < i; k++) {
                sum += L[j][k] * U[k][i];
            }
            L[j][i] = (matrix[j][i] - sum) / U[i][i];
        }
    }

    return [L, U];
}

// Function to find the inverse of a matrix using LU decomposition
function inverseMatrix(matrix: Matrix) {
    const n = matrix.length;
    const identity: Matrix = [];
    const [L, U] = luDecomposition(matrix);

    for (let i = 0; i < n; i++) {
        identity[i] = [];
        for (let j = 0; j < n; j++) {
            identity[i][j] = i === j ? 1 : 0;
        }
    }

    const inv: Matrix = [];
    for (let i = 0; i < n; i++) {
        inv[i] = [];
        const z: number[] = [];
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < j; k++) {
                sum += L[j][k] * z[k];
            }
            z[j] = (identity[i][j] - sum) / L[j][j];
        }

        const x: number[] = [];
        for (let j = n - 1; j >= 0; j--) {
            let sum = 0;
            for (let k = j + 1; k < n; k++) {
                sum += U[j][k] * x[k];
            }
            x[j] = (z[j] - sum) / U[j][j];
        }
        inv[i] = (x);
    }

    return transposeOfMatrix(inv);
}

function createFOfX(coefficients: number[]): (x: any) => number {
    return (x): number => {
        let y = 0
        for (let i = 0; i < coefficients.length; i++) {
            const c = coefficients[i]
            y += c * Math.pow(x, i)
        }
        return y
    }
}

// for the given coefficients that correspond to nth-degree polynomials
// check if a yValue is the value given by that polynomial
// where x = index of yValue
// coefficients: [1, -3, 2]
// f(x) = 1x⁰ + (-3) x¹ + 2x²
function checkFunctionFit(yValues: number[], coefficients: number[]): boolean {

    // console.log('checking', { yValues, coefficients })

    let f = createFOfX(coefficients)

    for (let x = 0; x < yValues.length; x++) {
        const y = yValues[x]
        let dSquared = Math.pow(y - f(x), 2)
        if (dSquared > 0.000001) {
            return false
        }
        // else { console.log({ y, fofx: f(x) }) }
    }
    // all y values = f(x) from function determined by coefficients

    return true
}

// given an array of numbers
// return an array of numbers that is length 1 less than the input
// where each value is the difference from i+1 and i from the input values
// input:  [1, 3, 8]
// output: [2, 5]
function getDerivativeValues(yValues: number[]): number[] {
    let derivatives: number[] = []
    for (let i = 0; i < yValues.length - 1; i++) {
        derivatives[i] = yValues[i + 1] - yValues[i]
    }
    return derivatives
}

// WHOOPS! in order to get this right, i would have to build a fancier data structure to store the C values! :)
// given an array of numbers
// return an array of numbers that is length 1 more than the input
// where each value is the sum from output[i-1] and input[i] from the input values
// and where output[0] = some seed value from input
// input: [2, 5] seed: 1
// output:  [1, 3, 8]
function getIntegralValues(yValues: number[], seed: number): number[] {
    // sum works because the values are rolling sums basically
    let sum = seed
    let integrals: number[] = [seed]
    for (let i = 0; i < yValues.length; i++) {
        sum += yValues[i]
        integrals.push(sum)
    }
    return integrals
}

let sum = 0

lineLoop: for (let i = 0; i < lines.length; i++) {
    let yValues = lines[i]
    let bestFitDegree = 0;
    let derivations = 0
    let cValues: number[] = [] // used to store first value when deriving in order to integrate later

    degreeLoop: for (let degree = 1; degree < 20; degree++) {
        // y values indeces are the x values

        const powersOfX = Array.from({ length: degree * 2 + 1 }, (_, i) =>
            sumOfArray(yValues.map((_, x) => Math.pow(x, i)))
        )

        const matrix: Matrix = Array.from({ length: degree + 1 }, (_, i) =>
            powersOfX.slice(i, i + degree + 1)
        )

        const product = multiplyMatrices(matrix, matrix)
        const inverse = inverseMatrix(product)

        const xy: Matrix = Array.from({ length: degree + 1 }, (_, i) =>
            [sumOfArray(yValues.map((val, x) => val * Math.pow(x, i)))]
        )

        // in this case, matrix === its own transpose
        let coefficientsMatrix: Matrix = multiplyMatrices(multiplyMatrices(inverse, matrix), xy)


        // rounding because the floating point approximation caused in the inverse function
        // will give us values extremely close to whole numbers, because we know the input
        // has nice whole answers
        // let coefficients: number[] = coefficientsMatrix.flatMap(row => row.map(Math.round))
        let coefficients: number[] = coefficientsMatrix.flatMap(row => row)

        for (let c of coefficients) {
            // if that baby was way too big, that's bad
            if (isNaN(c)) {
                // bad stuff baby

                // store the values we need later
                // and reset
                cValues.push(yValues[0])
                yValues = getDerivativeValues(yValues)
                derivations++
                degree = 0
                continue degreeLoop
            }
        }

        // console.log({ coefficients, degree })
        if (checkFunctionFit(yValues, coefficients)) {
            bestFitDegree = degree + derivations
            const f = createFOfX(coefficients)
            const nextValue = f(yValues.length)
            console.log({ nextValue })
            yValues.push(Math.round(nextValue))

            for (let d = 0; d < derivations; d++) {
                // for every derivation we did,
                // do an ingration
                const seed: number = cValues.pop() || 0
                yValues = getIntegralValues(yValues, seed)
            }



            // console.log('best fit', { bestFitDegree, degree, derivations, yValues })

            const last = yValues[yValues.length - 1]
            sum += last

            continue lineLoop
        }

    }
}

console.log({ sum })


const t3 = performance.now()
console.log("Input read time - ", t2 - t1, 'ms')
console.log("Execution time - ", t3 - t2, 'ms')