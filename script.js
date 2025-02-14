const fs = require('fs');

// Read JSON and decode Y values
function readAndDecode(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const n = data.keys.n;
    const k = data.keys.k;
    let points = [];

    Object.keys(data).forEach((key) => {
        if (key !== "keys") {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const y = parseInt(value, base);

            if (isNaN(y)) {
                console.error(`Error decoding value at x=${x} (base ${base}): ${value}`);
                process.exit(1);
            }

            points.push({ x, y });
        }
    });

    // Sort and select first k points
    points.sort((a, b) => a.x - b.x);
    let selectedPoints = points.slice(0, k);

    return selectedPoints;
}

// Calculate Lagrange Interpolation
function lagrangeInterpolation(points, x) {
    let result = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        let term = points[i].y;

        for (let j = 0; j < n; j++) {
            if (j !== i) {
                term *= (x - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }

    return Math.round(result);
}

// Process multiple test cases
const testCases = ['input.json', 'input2.json'];
let results = [];

testCases.forEach((file, index) => {
    let points = readAndDecode(file);
    let secret = lagrangeInterpolation(points, 0);
    results.push(`Test Case ${index + 1}: Constant term c = ${secret}`);
});

// Output
console.log(results.join("\n"));
