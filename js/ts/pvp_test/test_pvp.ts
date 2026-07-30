import { HttpUtils } from './HttpUtils';
import { Color, CommandRegistry, REPL } from './repl';
const http = new HttpUtils();

const registry = new CommandRegistry();

registry.register(
    'get',
    async (name?: string) => {
        const who = name || 'World';
        console.log(`\n  ${Color.green}Hello, ${who}!${Color.reset}\n`);
    },
    'Say hello',
    '[name]',
);

const repl = new REPL(registry);
repl.start();
