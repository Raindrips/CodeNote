import { defineConfig } from 'vite';
// import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            //   '@': path.resolve(__dirname, 'assets/scripts'), // 让你可以用 @ 引用脚本
            //   'cc': path.resolve(__dirname, 'node_modules/cc'), // 映射 Cocos Creator 引擎
        },
    },
    build: {
        target: 'esnext', // 确保支持最新 TS/ESM
    },
});
