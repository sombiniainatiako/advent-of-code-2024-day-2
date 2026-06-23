const fs = require('fs');

/**
 * Counts the number of safe reports in a given file.
 * @param {*} reportListFilePath 
 */
function countSafeReports(reportListFilePath) {
    let reportList = readTextFile(reportListFilePath).split('\n').filter(line => line.trim() !== '');
    let safeCount = 0;
    for (let report of reportList) {
        if (isSafeReport(report)) {
            safeCount++;
        }
    }
    return safeCount;
}

/**
 * Determines if a report is safe.
 * @param {*} report : The report string to evaluate.
 */
function isSafeReport(report) {
    let levels = report.split(' ').map(level => parseInt(level));
    if(levels.length < 1) return false; // No levels to evaluate
    let difference = levels[0] - levels[1];
    if(!checkAdjacentLevelSafety(difference, difference)) return false; // Difference is not within the allowed range
    for(let i = 1; i < levels.length - 1; i++) {
        let previousDifference = difference;
        difference = levels[i] - levels[i + 1];
        if(!checkAdjacentLevelSafety(previousDifference, difference)) return false; // Difference is not within the allowed range
    }
    return true;
}

function checkAdjacentLevelSafety(previousDifference, currentDifference) {
    return previousDifference * currentDifference > 0 && Math.abs(currentDifference) >= 1 && Math.abs(currentDifference) <= 3;
}
/**
 * Reads the contents of a text file.
 * @param {*} filePath 
 * @returns 
 */
function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a file path as an argument.');
    process.exit(1);
}

console.log(countSafeReports(filePath));