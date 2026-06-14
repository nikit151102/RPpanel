export type ToastType = 'success' | 'error' | 'info' | 'warning';
/** Модель одного уведомления */
export interface ToastMessage {
    id?: string;
    type?: ToastType;
    title?: string;
    message: string;
    duration?: number;
    icon?: string;
}
/** Классы CSS для кастомизации */
export interface ToastClasses {
    container?: string;
    toast?: string;
    icon?: string;
    content?: string;
    closeButton?: string;
}
/** Inline стили для кастомизации */
export interface ToastStyles {
    container?: Record<string, string>;
    toast?: Record<string, string>;
    icon?: Record<string, string>;
    content?: Record<string, string>;
}
