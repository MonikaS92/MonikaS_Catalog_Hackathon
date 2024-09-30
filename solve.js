// const fs = require('fs');

// // Helper function to decode y values from different bases
// function decodeY(base, value) {
//     return parseInt(value, base);
// }

// // Lagrange interpolation to find the constant term 'c' (secret)
// function lagrangeInterpolation(points, x) {
//     const k = points.length;
//     let secret = 0;

//     for (let i = 0; i < k; i++) {
//         let [xi, yi] = points[i];
//         let term = yi;

//         for (let j = 0; j < k; j++) {
//             if (i !== j) {
//                 let [xj] = points[j];
//                 term *= (x - xj) / (xi - xj);
//             }
//         }
//         secret += term;
//     }

//     return secret;
// }

// // Function to read and process the test case
// function processTestCase(filePath) {
//     const rawData = fs.readFileSync(filePath, 'utf8');
//     const testCase = JSON.parse(rawData);

//     const { n, k } = testCase.keys;
//     const points = [];

//     for (let key in testCase) {
//         if (key !== 'keys') {
//             const base = parseInt(testCase[key].base, 10);
//             const value = testCase[key].value;
//             const decodedY = decodeY(base, value);
//             points.push([parseInt(key), decodedY]);
//         }
//     }

//     // Calculate the secret using Lagrange interpolation for the first 'k' points
//     const secret = lagrangeInterpolation(points.slice(0, k), 0);
//     return { secret: Math.round(secret), points };
// }

// // Function to check if points lie on the polynomial
// function checkImposterPoints(points, secret) {
//     const imposterPoints = [];

//     // A simple check to find out points that do not satisfy the constant term (secret)
//     for (const [x, y] of points) {
//         const result = lagrangeInterpolation([[x, y]], 0); // Using the interpolation method
//         if (Math.round(result) !== Math.round(secret)) {
//             imposterPoints.push([x, y]);
//         }
//     }

//     return imposterPoints;
// }

// // Main function to solve both test cases
// function solve() {
//     // First test case
//     const testCase1 = processTestCase('testcase1.json');
//     console.log("Secret for TestCase 1 (constant term c):", testCase1.secret);

//     // Second test case
//     const testCase2 = processTestCase('testcase2.json');
//     console.log("Secret for TestCase 2 (constant term c):", testCase2.secret);

//     // Check for imposter points in the second test case
//     const imposterPoints = checkImposterPoints(testCase2.points, testCase2.secret);
//     if (imposterPoints.length > 0) {
//         console.log("Wrong points in TestCase 2:", imposterPoints);
//     } else {
//         console.log("No Wrong points in TestCase 2.");
//     }
// }

// solve();
const fs = require('fs');

// Function to decode the value based on the given base
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation
function lagrangeInterpolation(points) {
    const k = points.length;
    let secret = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let li = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j][0];
                li *= (0 - xj) / (xi - xj);
            }
        }

        secret += yi * li;
    }

    return Math.round(secret);  // Return the constant term (secret)
}

// Function to read the JSON file and decode points
function readTestCase(fileName) {
    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    const n = data.keys.n;
    const k = data.keys.k;

    let points = [];
    for (let key in data) {
        if (key !== 'keys') {
            let x = parseInt(key);  // x value is the key
            let base = parseInt(data[key].base);  // base of the y value
            let y = decodeValue(base, data[key].value);  // decoded y value
            points.push([x, y]);
        }
    }

    return { points, k };
}

// Function to find wrong points (second test case only)
function findWrongPoints(points, correctPoints) {
    const wrongPoints = points.filter(pt => !correctPoints.includes(pt));
    return wrongPoints;
}

// Main function to solve the assignment
function solveAssignment() {
    // Read the first test case
    const testCase1 = readTestCase('testcase1.json');
    const secret1 = lagrangeInterpolation(testCase1.points.slice(0, testCase1.k));
    
    // Read the second test case
    const testCase2 = readTestCase('testcase2.json');
    const secret2 = lagrangeInterpolation(testCase2.points.slice(0, testCase2.k));
    
    // Find wrong points (if any) in second test case
    const wrongPoints = findWrongPoints(testCase2.points, testCase2.points.slice(0, testCase2.k));
    
    // Output
    console.log("Secrets:");
    console.log("Test Case 1 Secret (C):", secret1);
    console.log("Test Case 2 Secret (C):", secret2);

    if (wrongPoints.length > 0) {
        console.log("Wrong Points in Test Case 2:", wrongPoints);
    } else {
        console.log("No Wrong Points in Test Case 2");
    }
}

// Call the main function
solveAssignment();
