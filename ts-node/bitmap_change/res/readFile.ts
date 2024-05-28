import { promises as fs } from 'fs';

const path="";

export async function readFile(filePath: string): Promise<string> {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
    }
    return ""
}