
export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  service?: string;
  transformationId?: string;
  userId?: string;
  metadata?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = process.env.NODE_ENV === 'development';

  log(level: LogEntry['level'], message: string, metadata?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata
    };

    // Ajouter au cache
    this.logs.push(entry);
    
    // Nettoyage automatique
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs * 0.8);
    }

    // Console output avec formatage
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}][${level.toUpperCase()}]`;
    
    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`, metadata);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, metadata);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`${prefix} ${message}`, metadata);
        }
        break;
      default:
        console.log(`${prefix} ${message}`, metadata);
    }
  }

  info(message: string, metadata?: any): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: any): void {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: any): void {
    this.log('error', message, metadata);
  }

  debug(message: string, metadata?: any): void {
    this.log('debug', message, metadata);
  }

  getLogs(level?: LogEntry['level'], limit?: number): LogEntry[] {
    let filtered = level ? this.logs.filter(log => log.level === level) : this.logs;
    return limit ? filtered.slice(-limit) : filtered;
  }

  getStats(): { total: number; errors: number; warnings: number } {
    return {
      total: this.logs.length,
      errors: this.logs.filter(log => log.level === 'error').length,
      warnings: this.logs.filter(log => log.level === 'warn').length
    };
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
