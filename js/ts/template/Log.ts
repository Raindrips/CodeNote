enum LogLevel {
    'DEBUG',
    'INFO',
    'WARNING',
    'ERROR',
    'ALL',
}
class Log {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel) {
        this.logLevel = logLevel;
    }

    public log(message: string, logLevel: LogLevel): void {
        if (logLevel >= this.logLevel) {
            const formattedMessage = this.formatMessage(message, logLevel);
            this.emit(formattedMessage);
        }
    }

    private formatMessage(message: string, logLevel: number): string {
        const timestamp = new Date().toLocaleString();
        return `[${timestamp}] [${this.getLogLevelString(
            logLevel,
        )}] ${message}`;
    }

    private getLogLevelString(logLevel: number): string {
        switch (logLevel) {
            case 1:
                return 'DEBUG';
            case 2:
                return 'INFO';
            case 3:
                return 'WARNING';
            case 4:
                return 'ERROR';
            default:
                return logLevel + '';
        }
    }

    private emit(formattedMessage: string): void {
        console.trace(formattedMessage);
    }
}

const log = new Log(LogLevel.DEBUG);

() => {
    log.log('hello', LogLevel.DEBUG);
};
