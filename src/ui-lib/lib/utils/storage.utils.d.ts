/**
 * Утилиты для кэширования данных
 */
export declare class StorageUtils {
    private static memoryCache;
    /**
     * Проверяет, валиден ли кэш (не истекло ли время)
     * @param expires timestamp в ms
     */
    private static isCacheValid;
    /**
     * Сохраняет данные в памяти
     * @param key Ключ
     * @param data Данные
     * @param ttl Время жизни в секундах (по умолчанию 5 минут)
     */
    static setMemoryCache<T>(key: string, data: T, ttl?: number): void;
    /**
     * Получает данные из памяти
     * @param key Ключ
     * @returns Данные или null, если кэш невалиден
     */
    static getMemoryCache<T>(key: string): T | null;
    /**
     * Очищает кэш в памяти по ключу или полностью
     * @param key Если не указан, очищает весь кэш
     */
    static clearMemoryCache(key?: string): void;
    /**
     * Сохраняет данные в localStorage с TTL
     * @param key Ключ
     * @param data Данные
     * @param ttl Время жизни в секундах
     */
    static setLocalStorageCache<T>(key: string, data: T, ttl: number): void;
    /**
     * Получает данные из localStorage
     * @param key Ключ
     * @returns Данные или null, если кэш невалиден
     */
    static getLocalStorageCache<T>(key: string): T | null;
    /**
     * Сохраняет данные в sessionStorage (живут до закрытия вкладки)
     * @param key Ключ
     * @param data Данные
     */
    static setSessionStorage<T>(key: string, data: T): void;
    /**
     * Получает данные из sessionStorage
     * @param key Ключ
     */
    static getSessionStorage<T>(key: string): T | null;
    /**
     * Пытается получить данные из кэшей по приоритету:
     * 1. Память → 2. localStorage → 3. sessionStorage
     * @param key Ключ
     */
    static getFromAnyCache<T>(key: string): T | null;
}
