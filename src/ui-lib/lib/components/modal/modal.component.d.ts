import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Модель кнопки модального окна
 */
export interface ModalButton {
    /** Текст кнопки */
    label: string;
    /** Цвет кнопки (primary, secondary, danger, custom HEX/RGB) */
    color?: 'primary' | 'secondary' | 'danger' | string;
    /** Действие при нажатии */
    action: () => void;
    /** Неактивна ли кнопка */
    disabled?: boolean;
    /** Кастомные CSS-классы */
    customClass?: string;
    textColor?: string;
    /** Tooltip или подсказка */
    tooltip?: string;
    /** Иконка (эмодзи, SVG или HTML) */
    icon?: string;
    isPrimary?: true;
}
/**
 * Классы CSS для модального окна
 */
export interface ModalClasses {
    overlay?: string;
    container?: string;
    header?: string;
    body?: string;
    footer?: string;
    closeButton?: string;
    button?: string;
}
/**
 * Inline-стили для модального окна
 */
export interface ModalStyles {
    overlay?: Record<string, string>;
    container?: Record<string, string>;
    header?: Record<string, string>;
    body?: Record<string, string>;
    footer?: Record<string, string>;
}
export declare class ModalComponent {
    /** Заголовок модального окна */
    title: string;
    /** Состояние — открыта ли модалка */
    isOpen: boolean;
    /** Контент модалки (HTML или текст) */
    bodyText: string;
    /** Массив кнопок в нижней панели */
    buttons: ModalButton[];
    /** Кастомные CSS-классы */
    customClasses: Partial<ModalClasses>;
    /** Кастомные inline-стили */
    customStyles: Partial<ModalStyles>;
    /** Можно ли закрыть по клику на фон */
    closeOnOverlayClick: boolean;
    /** Событие при открытии окна */
    opened: EventEmitter<void>;
    /** Событие при закрытии окна */
    closed: EventEmitter<void>;
    /** Открыть окно */
    open(): void;
    /** Закрыть окно */
    close(): void;
    /** Клик по фону */
    onOverlayClick(event: MouseEvent): void;
    /** Получить стиль кнопки по типу */
    getButtonStyle(button: ModalButton): Record<string, string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ModalComponent, "lib-modal", never, { "title": { "alias": "title"; "required": false; }; "isOpen": { "alias": "isOpen"; "required": false; }; "bodyText": { "alias": "bodyText"; "required": false; }; "buttons": { "alias": "buttons"; "required": false; }; "customClasses": { "alias": "customClasses"; "required": false; }; "customStyles": { "alias": "customStyles"; "required": false; }; "closeOnOverlayClick": { "alias": "closeOnOverlayClick"; "required": false; }; }, { "opened": "opened"; "closed": "closed"; }, never, never, true, never>;
}
