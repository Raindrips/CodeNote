import { Color, CommandRegistry, REPL } from './repl';

const registry = new CommandRegistry();

registry.register(
    'greet',
    async (name?: string) => {
        const who = name || 'World';
        console.log(`\n  ${Color.green}Hello, ${who}!${Color.reset}\n`);
    },
    'Say hello',
    '[name]',
);

registry.register(
    'delay',
    async (ms?: string) => {
        const t = parseInt(ms ?? '1000', 10);
        console.log(`  ${Color.yellow}Waiting ${t}ms...${Color.reset}`);
        await new Promise((r) => setTimeout(r, t));
        console.log(`  ${Color.green}Done!${Color.reset}`);
    },
    'Async delay demo',
    '[ms=1000]',
);

registry.register(
    'fetch',
    async (url?: string) => {
        const target = url || 'https://httpbin.org/get';
        console.log(`  ${Color.cyan}Fetching ${target}...${Color.reset}`);
        const res = await fetch(target);
        const data = await res.text();
        console.log(`  ${Color.dim}Status: ${res.status}${Color.reset}`);
        console.log(`  ${Color.dim}${data.slice(0, 300)}${Color.reset}`);
    },
    'HTTP GET request',
    '[url]',
);

registry.register(
    'env',
    async (key?: string) => {
        if (key) {
            const val = process.env[key];
            console.log(
                val !== undefined
                    ? `  ${Color.green}${key}${Color.reset} = ${Color.dim}${val}${Color.reset}`
                    : `  ${Color.yellow}${key} is not set${Color.reset}`,
            );
        } else {
            const keys = Object.keys(process.env).sort();
            console.log(`  ${Color.bold}${keys.length} env vars:${Color.reset}`);
            keys.slice(0, 20).forEach((k) => {
                console.log(
                    `    ${Color.green}${k}${Color.reset} = ${Color.dim}${process.env[k]?.slice(0, 60)}${Color.reset}`,
                );
            });
            if (keys.length > 20)
                console.log(`    ${Color.dim}... and ${keys.length - 20} more${Color.reset}`);
        }
    },
    'Read environment variable',
    '[key]',
);

registry.register(
    'math',
    async (expr?: string) => {
        if (!expr) {
            console.log(`  ${Color.yellow}Usage: math <expression>${Color.reset}`);
            console.log(`  ${Color.dim}Example: math 2 + 3 * 4${Color.reset}`);
            return;
        }
        // Safe-ish eval: only allow digits, operators, parens, dots, spaces
        const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, '');
        if (sanitized !== expr) {
            console.log(`  ${Color.red}Invalid characters in expression${Color.reset}`);
            return;
        }
        try {
            const result = new Function(`return (${sanitized})`)();
            console.log(`  ${Color.green}${expr} = ${result}${Color.reset}`);
        } catch {
            console.log(`  ${Color.red}Failed to evaluate: ${expr}${Color.reset}`);
        }
    },
    'Evaluate a math expression',
    '<expression>',
);

registry.register(
    'time',
    async () => {
        const now = new Date();
        console.log(`\n  ${Color.bold}${now.toLocaleString()}${Color.reset}`);
        console.log(`  ${Color.dim}ISO: ${now.toISOString()}${Color.reset}`);
        console.log(`  ${Color.dim}Unix: ${Math.floor(now.getTime() / 1000)}${Color.reset}\n`);
    },
    'Show current date & time',
);

const repl = new REPL(registry);
repl.start();
