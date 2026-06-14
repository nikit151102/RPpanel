/**
 * Уровни логирования
 */
export declare enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL"
}
/**
 * Сервис для логирования с поддержкой разных уровней и форматов
 */
export declare class Logger {
    private readonly context;
    constructor(context?: string);
    /**
     * Форматирование сообщения для консоли
     */
    private formatConsoleMessage;
    /**
     * Отправка логов на сервер (например, Sentry/ELK)
     */
    private sendToServer;
    /**
     * Базовый метод логирования
     */
    private log;
    debug(message: string, data?: any, environment?: string): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, error?: Error | any, data?: any): void;
    critical(message: string, error?: Error, data?: any): void;
    /**
     * Логирование HTTP-ошибок
     */
    httpError(message: string, error: any, context?: {
        url?: string;
        status?: number;
    }): void;
    /**
     * Логирование жизненного цикла компонента
     */
    componentLifecycle(componentName: string, lifecycle: 'OnInit' | 'OnDestroy' | 'OnChanges', data?: any): void;
}
/**
 * Глобальный экземпляр логгера
 */
export declare const logger: Logger;
/**
 * Декоратор для логирования методов класса
 */
export declare function LogMethod(target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor;
/**
 * Утилита для логирования времени выполнения функции
 */
export declare function logExecutionTime<T>(fn: (...args: any[]) => T, context?: string): (...args: any[]) => T;
