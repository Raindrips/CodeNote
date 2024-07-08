import * as fs from 'fs';
import * as path from 'path';

const ffmpeg = require('fluent-ffmpeg');
const wav = require('wav');

// 输入和输出文件路径
const inputFilePath = 'input.mp3';
const outputFilePath = 'output.wav';

// 将 MP3 文件转换为 WAV 文件
ffmpeg(inputFilePath)
    .toFormat('wav')
    .on('end', () => {
        console.log('Conversion finished.');
        readWavFile(outputFilePath);
    })
    .on('error', (err:Error) => {
        console.error('Error during conversion:', err);
    })
    .save(outputFilePath);

// 读取 WAV 文件并获取音频数据
function readWavFile(filePath:string,isSave=false) {
    const reader = new wav.Reader();

    reader.on('format', (format: any) => {
        console.log('Format:', format);
    });

    reader.on('data', (data:any) => {
        console.log('Audio data:', data);
        // 在这里可以处理音频数据，例如计算波长
    });
    if(isSave){
        fs.createReadStream(filePath).pipe(reader);
    }
}