import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import htmlPlugin from '@html-eslint/eslint-plugin';
import htmlParser from '@html-eslint/parser';
import globals from 'globals';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);

// 使用 createRequire 来加载 CommonJS 格式的插件
const internalLinksPlugin = require('./scripts/eslint-plugin-internal-links.cjs');
const requireSrcPlugin = require('./scripts/eslint-plugin-require-src.cjs');

export default [
  {
    files: ['**/*.js'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'internal-links': internalLinksPlugin,
    },
    rules: {
      // 预防 Uncaught SyntaxError
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'no-import-assign': 'error',
      'no-func-assign': 'error',
      'no-useless-catch': 'error',
      'no-useless-return': 'error',
      // 使用自定义插件检查内部链接
      'internal-links/no-window-open-internal': 'error',
    },
  },
  // HTML 文件配置
  {
    files: ['**/*.html'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: htmlParser,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@html-eslint': htmlPlugin,
      'internal-links': internalLinksPlugin,
      'require-src': requireSrcPlugin,
    },
    rules: {
      // 预防 Uncaught SyntaxError
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'no-import-assign': 'error',
      'no-func-assign': 'error',
      'no-useless-catch': 'error',
      'no-useless-return': 'error',
      // 使用自定义插件检查内部链接
      'internal-links/no-window-open-internal': 'error',
      // HTML 相关规则
      '@html-eslint/indent': 'off', // 让 Prettier 处理缩进
      '@html-eslint/require-closing-tags': [
        'error',
        {
          selfClosing: 'never',
          allowSelfClosingCustom: true,
        },
      ],
      '@html-eslint/no-duplicate-attrs': 'error',
      // 自定义规则：检测 img 和 source 标签的 src/srcset 属性
      'require-src/require-img-src': 'error',
      'require-src/require-source-src': 'error',
    },
  },
];
