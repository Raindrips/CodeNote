import { readJsonFile } from './file_utils';

const fs = require('fs');
const path = require('path');

function getArgs() {
    if (process.argv.length < 3) {
        console.error(
            'Please provide input and output file paths as arguments.',
        );
    }
    let inputPath = process.argv[2];
    if (!inputPath) inputPath = '';

    let outputPath = process.argv[3];
    if (!outputPath) outputPath = '';
    return [inputPath, outputPath];
}

function main() {
    let [inputPath, outputPath] = getArgs();
    const buf = readJsonFile(inputPath);
    const data=JSON.parse(buf.toString());
    console.log(data);
}

main();
