export class Logger {
  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const argsStr = args.length > 0 ? ' ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ') : '';
    return `${prefix} ${message}${argsStr}`;
  }

  info(message: string, ...args: any[]): void {
    console.log(this.formatMessage('info', message, ...args));
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('error', message, ...args));
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('warn', message, ...args));
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }

  success(message: string, ...args: any[]): void {
    console.log(this.formatMessage('success', message, ...args));
  }
}

export const logger = new Logger();
export default logger;