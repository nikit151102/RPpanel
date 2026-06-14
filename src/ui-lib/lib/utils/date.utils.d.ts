/**
 * Утилиты для работы с датами
 */
type DateInput = Date | string | number;
/**
 * Приводит любое значение к объекту Date
 * (работает с timestamp, ISO-строками и Date)
 */
export declare const parseDate: (input: DateInput) => Date;
/**
 * Проверяет, является ли значение валидной датой
 */
export declare const isValidDate: (date: DateInput) => boolean;
/**
 * Форматирует дату в "DD.MM.YYYY" (например, "12.05.2023")
 */
export declare const formatShortDate: (date: DateInput) => string;
/**
 * Форматирует дату в "12 мая 2023 г."
 */
export declare const formatLongDate: (date: DateInput) => string;
/**
 * Форматирует дату и время "12.05.2023, 14:30"
 */
export declare const formatDateTime: (date: DateInput) => string;
/**
 * Форматирует время доставки (например, "14:30-16:30")
 */
export declare const formatTimeRange: (start: DateInput, end: DateInput) => string;
/**
 * Сравнивает две даты (без учета времени)
 * Возвращает:
 *  -1 если date1 < date2
 *   0 если date1 == date2
 *   1 если date1 > date2
 */
export declare const compareDates: (date1: DateInput, date2: DateInput) => number;
/**
 * Проверяет, является ли дата сегодняшним днем
 */
export declare const isToday: (date: DateInput) => boolean;
/**
 * Проверяет, является ли дата вчерашним днем
 */
export declare const isYesterday: (date: DateInput) => boolean;
/**
 * Добавляет указанное количество дней к дате
 */
export declare const addDays: (date: DateInput, days: number) => Date;
/**
 * Рассчитывает разницу между датами в днях
 */
export declare const diffInDays: (date1: DateInput, date2: DateInput) => number;
/**
 * Рассчитывает предполагаемую дату доставки
 * (например: +3 рабочих дня от текущей даты)
 */
export declare const getDeliveryDate: (startDate?: DateInput, workingDays?: number) => Date;
/**
 * Форматирует срок доставки для UI
 * (например: "Доставка: 15-17 мая")
 */
export declare const formatDeliveryRange: (start: DateInput, daysRange?: number) => string;
/**
 * Проверяет, истекла ли дата (например, для акций)
 */
export declare const isExpired: (expiryDate: DateInput) => boolean;
export {};
