/**
 * Проверяет валидность email
 * @param email - Проверяемая строка
 * @returns boolean
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Проверяет сложность пароля:
 * - Минимум 8 символов
 * - Хотя бы 1 цифра
 * - Хотя бы 1 буква в верхнем и нижнем регистре
 * @param password - Проверяемый пароль
 * @returns boolean
 */
export declare const isStrongPassword: (password: string) => boolean;
/**
 * Проверяет валидность российского номера телефона
 * @param phone - Номер в формате +7..., 8..., или без кода страны
 * @returns boolean
 */
export declare const isValidRussianPhone: (phone: string) => boolean;
/**
 * Проверяет валидность ИНН (для юр. и физ. лиц)
 * @param inn - ИНН (10 или 12 цифр)
 * @returns boolean
 */
export declare const isValidINN: (inn: string) => boolean;
/**
 * Проверяет валидность номера карты по алгоритму Луна
 * @param cardNumber - Номер карты (без пробелов)
 * @returns boolean
 */
export declare const isValidCreditCard: (cardNumber: string) => boolean;
/**
 * Проверяет валидность CVV/CVC кода карты
 * @param cvv - Код (3 или 4 цифры)
 * @returns boolean
 */
export declare const isValidCVV: (cvv: string) => boolean;
/**
 * Проверяет валидность срока действия карты (MM/YY)
 * @param expiry - Строка в формате MM/YY
 * @returns boolean
 */
export declare const isValidCardExpiry: (expiry: string) => boolean;
/**
 * Проверяет формат промокода (например, только буквы и цифры)
 * @param promoCode - Промокод
 * @param pattern - Регулярное выражение (по умолчанию /^[A-Z0-9]{6,12}$/i)
 * @returns boolean
 */
export declare const isValidPromoCode: (promoCode: string, pattern?: RegExp) => boolean;
/**
 * Проверяет, что количество товара в корзине допустимо
 * @param quantity - Количество
 * @param max - Максимальное значение (по умолчанию 100)
 * @returns boolean
 */
export declare const isValidProductQuantity: (quantity: number, max?: number) => boolean;
/**
 * Проверяет, что строка является валидным URL изображения
 * @param url - Ссылка на изображение
 * @returns boolean
 */
export declare const isValidImageUrl: (url: string) => boolean;
/**
 * Проверяет, что строка не пустая и не состоит только из пробелов
 * @param value - Проверяемая строка
 * @returns boolean
 */
export declare const isNotEmpty: (value: string) => boolean;
/**
 * Проверяет минимальную длину строки
 * @param value - Проверяемая строка
 * @param minLength - Минимальная длина
 * @returns boolean
 */
export declare const hasMinLength: (value: string, minLength: number) => boolean;
/**
 * Проверяет максимальную длину строки
 * @param value - Проверяемая строка
 * @param maxLength - Максимальная длина
 * @returns boolean
 */
export declare const hasMaxLength: (value: string, maxLength: number) => boolean;
/**
 * Проверяет, что строка содержит только буквы (латиница или кириллица)
 * @param value - Проверяемая строка
 * @param allowSpaces - Разрешить пробелы
 * @returns boolean
 */
export declare const isAlpha: (value: string, allowSpaces?: boolean) => boolean;
/**
 * Проверяет, что значение является положительным числом
 * @param value - Проверяемое значение
 * @returns boolean
 */
export declare const isPositiveNumber: (value: number) => boolean;
/**
 * Проверяет, что значение находится в заданном диапазоне
 * @param value - Проверяемое значение
 * @param min - Минимальное значение
 * @param max - Максимальное значение
 * @returns boolean
 */
export declare const isInRange: (value: number, min: number, max: number) => boolean;
/**
 * Проверяет, что значение является целым числом
 * @param value - Проверяемое значение
 * @returns boolean
 */
export declare const isInteger: (value: number) => boolean;
/**
 * Проверяет, что дата является будущей (относительно текущей даты)
 * @param date - Проверяемая дата
 * @returns boolean
 */
export declare const isFutureDate: (date: Date) => boolean;
/**
 * Проверяет, что дата является прошедшей (относительно текущей даты)
 * @param date - Проверяемая дата
 * @returns boolean
 */
export declare const isPastDate: (date: Date) => boolean;
/**
 * Проверяет, что дата находится в допустимом диапазоне
 * @param date - Проверяемая дата
 * @param startDate - Начальная дата диапазона
 * @param endDate - Конечная дата диапазона
 * @returns boolean
 */
export declare const isDateInRange: (date: Date, startDate: Date, endDate: Date) => boolean;
/**
 * Проверяет валидность почтового индекса (для России)
 * @param zipCode - Проверяемый индекс
 * @returns boolean
 */
export declare const isValidRussianZipCode: (zipCode: string) => boolean;
/**
 * Проверяет валидность адреса (базовая проверка)
 * @param address - Проверяемый адрес
 * @returns boolean
 */
export declare const isValidAddress: (address: string) => boolean;
/**
 * Проверяет расширение файла
 * @param fileName - Имя файла
 * @param allowedExtensions - Массив разрешенных расширений (например, ['jpg', 'png'])
 * @returns boolean
 */
export declare const hasValidFileExtension: (fileName: string, allowedExtensions: string[]) => boolean;
/**
 * Проверяет размер файла (в байтах)
 * @param fileSize - Размер файла в байтах
 * @param maxSize - Максимальный размер в байтах
 * @returns boolean
 */
export declare const isValidFileSize: (fileSize: number, maxSize: number) => boolean;
/**
 * Проверяет валидность артикула товара
 * @param sku - Артикул товара
 * @param pattern - Регулярное выражение (по умолчанию /^[A-Z0-9-]{5,20}$/i)
 * @returns boolean
 */
export declare const isValidProductSKU: (sku: string, pattern?: RegExp) => boolean;
/**
 * Проверяет валидность ISBN (книги)
 * @param isbn - Проверяемый ISBN
 * @returns boolean
 */
export declare const isValidISBN: (isbn: string) => boolean;
/**
 * Проверяет валидность HEX-цвета (например, #FFFFFF)
 * @param color - Проверяемый цвет
 * @returns boolean
 */
export declare const isValidHexColor: (color: string) => boolean;
/**
 * Проверяет валидность имени пользователя
 * (латинские/кириллические буквы, цифры, подчеркивания, точки)
 * @param username - Имя пользователя
 * @param minLength - Минимальная длина (по умолчанию 3)
 * @param maxLength - Максимальная длина (по умолчанию 20)
 * @returns boolean
 */
export declare const isValidUsername: (username: string, minLength?: number, maxLength?: number) => boolean;
/**
 * Проверяет валидность домена
 * @param domain - Проверяемый домен
 * @returns boolean
 */
export declare const isValidDomain: (domain: string) => boolean;
/**
 * Проверяет валидность международного номера телефона
 * @param phone - Номер телефона
 * @returns boolean
 */
export declare const isValidInternationalPhone: (phone: string) => boolean;
/**
 * Проверяет валидность SWIFT-кода
 * @param swift - SWIFT-код
 * @returns boolean
 */
export declare const isValidSWIFT: (swift: string) => boolean;
