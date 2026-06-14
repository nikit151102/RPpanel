export declare class ColorUtils {
    /**
     * Преобразует HEX в RGB
     */
    static hexToRgb(hex: string): {
        r: number;
        g: number;
        b: number;
    } | null;
    /**
     * Преобразует RGB в HEX
     */
    static rgbToHex(r: number, g: number, b: number): string;
    /**
     * Создание более светлого оттенка цвета
     * @param hex базовый цвет
     * @param amount 0-1 (0 = без изменения, 1 = белый)
     */
    static lighten(hex: string, amount: number): string;
    /**
     * Создание более тёмного оттенка цвета
     * @param hex базовый цвет
     * @param amount 0-1 (0 = без изменения, 1 = чёрный)
     */
    static darken(hex: string, amount: number): string;
    /**
     * Возвращает контрастный цвет (чёрный или белый) для текста
     */
    static contrast(hex: string): '#000000' | '#FFFFFF';
    /**
     * Создание палитры оттенков для цвета
     * @param hex базовый цвет
     * @param steps количество оттенков
     */
    static palette(hex: string, steps?: number): string[];
}
