import * as readline from 'readline';

type AsyncHandler = (...args: string[]) => Promise<void>;

interface CommandEntry {
    handler: AsyncHandler;
    description: string;
    usage?: string;
}

export const Color = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgGreen: '\x1b[42m',
    bgRed: '\x1b[41m',
    bgYellow: '\x1b[43m',
} as const;

export class CommandRegistry {
    private commands = new Map<string, CommandEntry>();

    /**
     * Register a command with a string key and an async handler.
     *
     * @param name        - The string the user types to invoke this command
     * @param handler     - The async function to execute
     * @param description - A short help description
     * @param usage       - Optional usage string shown in help
     */
    register(name: string, handler: AsyncHandler, description: string, usage?: string): this {
        if (this.commands.has(name)) {
            console.log(`${Color.yellow}⚠  Overwriting existing command "${name}"${Color.reset}`);
        }
        this.commands.set(name, { handler, description, usage });
        return this;
    }

    /** Unregister a previously registered command */
    unregister(name: string): boolean {
        return this.commands.delete(name);
    }

    /** Get all registered command names */
    list(): string[] {
        return Array.from(this.commands.keys());
    }

    /** Check if a command exists */
    has(name: string): boolean {
        return this.commands.has(name);
    }

    /** Execute a command by name, passing remaining tokens as args */
    async execute(name: string, args: string[]): Promise<void> {
        const entry = this.commands.get(name);
        if (!entry) {
            throw new Error(`Unknown command: "${name}"`);
        }
        await entry.handler(...args);
    }

    /** Print a formatted help table */
    printHelp(): void {
        console.log(
            `\n${Color.bold}${Color.cyan}┌─────────────────────────────────────────────┐${Color.reset}`,
        );
        console.log(
            `${Color.bold}${Color.cyan}│            Registered Commands               │${Color.reset}`,
        );
        console.log(
            `${Color.bold}${Color.cyan}├─────────────────────────────────────────────┤${Color.reset}`,
        );

        for (const [name, entry] of this.commands) {
            const paddedName = name.padEnd(16);
            const usageStr = entry.usage ? `  ${Color.dim}${entry.usage}${Color.reset}` : '';
            console.log(
                `${Color.bold}${Color.cyan}│${Color.reset}  ${Color.green}${paddedName}${Color.reset} ${entry.description}${usageStr}`,
            );
        }

        console.log(
            `${Color.bold}${Color.cyan}├─────────────────────────────────────────────┤${Color.reset}`,
        );
        console.log(
            `${Color.bold}${Color.cyan}│${Color.reset}  ${Color.yellow}help${' '.repeat(13)}Show this help message`,
        );
        console.log(
            `${Color.bold}${Color.cyan}│${Color.reset}  ${Color.yellow}list${' '.repeat(13)}List all command names`,
        );
        console.log(
            `${Color.bold}${Color.cyan}│${Color.reset}  ${Color.yellow}exit${' '.repeat(13)}Exit the REPL`,
        );
        console.log(
            `${Color.bold}${Color.cyan}└─────────────────────────────────────────────┘${Color.reset}\n`,
        );
    }
}

export class REPL {
    private rl: readline.Interface;
    private registry: CommandRegistry;
    private history: string[] = [];
    private promptSymbol = `${Color.magenta}->${Color.reset} `;

    constructor(registry: CommandRegistry) {
        this.registry = registry;
        this.rl = readline.createInterface({
            input: process.stdin as any,
            output: process.stdout as any,
            prompt: this.promptSymbol,
            historySize: 100,
        });
    }

    /** Parse a raw input line into [commandName, ...args] */
    private parse(input: string): [string, string[]] {
        const trimmed = input.trim();
        // Split by spaces, respecting quoted strings
        const tokens: string[] = [];
        let current = '';
        let inQuote = false;
        let quoteChar = '';

        for (const ch of trimmed) {
            if (inQuote) {
                if (ch === quoteChar) {
                    inQuote = false;
                } else {
                    current += ch;
                }
            } else if (ch === '"' || ch === "'") {
                inQuote = true;
                quoteChar = ch;
            } else if (ch === ' ' || ch === '\t') {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
            } else {
                current += ch;
            }
        }
        if (current) tokens.push(current);

        const [command = '', ...args] = tokens;
        return [command, args];
    }

    /** Display the startup banner */
    private printBanner(): void {
        const line = `${Color.dim}${'─'.repeat(47)}${Color.reset}`;
        console.log(line);
        console.log(
            `${Color.bold}${Color.cyan}  Interactive Command Tester${Color.reset}  ${Color.dim}v1.0${Color.reset}`,
        );
        console.log(`${Color.dim}  Type "help" to see available commands.${Color.reset}`);
        console.log(line);
    }

    /** Start the REPL loop */
    async start(): Promise<void> {
        this.printBanner();
        this.rl.prompt();

        this.rl.on('line', async (line: string) => {
            const [command, args] = this.parse(line);

            if (!command) {
                this.rl.prompt();
                return;
            }

            this.history.push(line);

            try {
                switch (command) {
                    case 'exit':
                    case 'quit':
                    case 'q':
                        console.log(`\n${Color.dim}Goodbye!${Color.reset}\n`);
                        this.rl.close();
                        return;

                    case 'help':
                    case '?':
                        this.registry.printHelp();
                        break;

                    case 'list':
                        const names = this.registry.list();
                        if (names.length === 0) {
                            console.log(
                                `${Color.yellow}  No commands registered yet.${Color.reset}`,
                            );
                        } else {
                            console.log(`\n  ${Color.bold}Commands:${Color.reset}`);
                            names.forEach((n) =>
                                console.log(`    ${Color.green}•${Color.reset} ${n}`),
                            );
                            console.log();
                        }
                        break;

                    default:
                        if (!this.registry.has(command)) {
                            console.log(
                                `  ${Color.red}✖ Unknown command: "${command}"${Color.reset}  ${Color.dim}(type "help" for available commands)${Color.reset}`,
                            );
                        } else {
                            const start = Date.now();
                            await this.registry.execute(command, args);
                            const elapsed = Date.now() - start;
                            console.log(`  ${Color.dim}✓ completed in ${elapsed}ms${Color.reset}`);
                        }
                }
            } catch (err: any) {
                console.log(
                    `\n  ${Color.bgRed}${Color.white}${Color.bold} ERROR ${Color.reset} ${Color.red}${err.message ?? err}${Color.reset}\n`,
                );
            }

            this.rl.prompt();
        });

        this.rl.on('close', () => {
            process.exit(0);
        });
    }
}
