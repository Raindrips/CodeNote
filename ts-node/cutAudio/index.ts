import * as fs from 'fs';
import * as path from 'path';
import { RecordUtils } from './RecordUtils';
import { ZipArray } from './zip';
import { cutAudios } from './musicCut';

const ffmpeg = require('fluent-ffmpeg');
const wav = require('wav');

// 输入和输出文件路径
const inputFilePath = 'E:/mp3/111/atlas.mp3';
const outputFilePath = 'E:/mp3/111/output.wav';

const record = new RecordUtils();

// 将 MP3 文件转换为 WAV 文件
ffmpeg(inputFilePath)
    .toFormat('wav')
    .on('end', () => {
        console.log('Conversion finished.');
        readWavFile(outputFilePath);
    })
    .on('error', (err: Error) => {
        console.error('rror during conveErsion:', err);
    })
    .save(outputFilePath);

// 读取 WAV 文件并获取音频数据
async function readWavFile(filePath: string) {
    const row = 400;
    const offset = 192000 / row;
    let i = 0;

    const reader = new wav.Reader();

    let count = 0;
    const rs = fs.createReadStream(filePath)
    rs.pipe(reader);
    rs.addListener('close', () => {
        console.log('buff count', count);
        record.stop(reader.chunkSize);
        const rank = record.format(record.getRecords(), row);
        console.log(rank)
        console.log('rank', rank.length)
        // cutMusic(rank);
        outRank(rank);
    })
    reader.on('format', (format: Buffer) => {
        console.log('Format:', format);
        logReader(reader);
    });

    reader.on('data', (data: Buffer) => {
        const len = Math.floor(data.length)
        let i = 0;
        while (i < len) {
            let flag = 0;
            let start = i;
            let end = i + offset;
            if (end > len) { end = len; }
            for (let j = start; j < end; j += 2) {
                const d = data.readInt16LE(j)
                if (d != 0) {
                    flag = 1;
                    break;
                }
            }
            record.addData(flag, count)
            i += offset;
            count++;
        }
    });
}

function cutMusic(rank: string[][]) {
    rank.forEach((group, i) => {
        const start = group[0];
        const end = group[1];
        cutAudios("atlas.mp3", `${i}.mp3`, start, end);
    });
}

function outRank(rank: string[][]) {
    rank.forEach((group, i) => {
        const start = group[0];
        const end = group[1];
        console.log(start, end);
    });
}

function logReader(reader: any) {
    reader.once('readable', function () {
        console.log('WaveHeader Size:\t%d', 12);
        console.log('ChunkHeader Size:\t%d', 8);
        console.log('FormatChunk Size:\t%d', reader.subchunk1Size);
        console.log('RIFF ID:\t%s', reader.riffId);
        console.log('Total Size:\t%d', reader.chunkSize);
        console.log('Wave ID:\t%s', reader.waveId);
        console.log('Chunk ID:\t%s', reader.chunkId);
        console.log('Chunk Size:\t%d', reader.subchunk1Size);
        console.log('Compression format is of type: %d', reader.audioFormat);
        console.log('Channels:\t%d', reader.channels);
        console.log('Sample Rate:\t%d', reader.sampleRate);
        console.log('Bytes / Sec:\t%d', reader.byteRate);
        console.log('wBlockAlign:\t%d', reader.blockAlign);
        console.log('Bits Per Sample Point:\t%d', reader.bitDepth);
        // TODO: this should end up being "44" or whatever the total length of the WAV
        //       header is. maybe emit "format" at this point rather than earlier???
        console.log('wavDataPtr: %d', 0);
        console.log('wavDataSize: %d', reader.subchunk2Size);
        console.log();
    });
}