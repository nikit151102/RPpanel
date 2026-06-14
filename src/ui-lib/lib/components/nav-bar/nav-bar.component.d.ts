import { EventEmitter } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import * as i0 from "@angular/core";
/**
 * Элемент горизонтального меню
 */
export interface HorizontalMenuItem {
    /** Текст пункта меню */
    label: string;
    /** Иконка (текстовая или SVG) */
    icon?: string | SafeHtml;
    /** Ссылка для маршрутизации */
    router: string;
    /** Дополнительный бейдж (например, количество уведомлений) */
    badge?: string;
    /** Кастомные CSS-классы для конкретного элемента */
    customClasses?: Partial<NavBarItemClasses>;
    /** Кастомные inline-стили для конкретного элемента */
    customStyles?: Partial<NavBarItemStyles>;
}
/**
 * CSS-классы для элементов навбара
 */
export interface NavBarClasses {
    /** Основной контейнер меню */
    container: string;
    /** Элемент меню */
    item: string;
    /** Активный пункт */
    active: string;
    /** Обертка меню (при необходимости) */
    menuWrapper?: string;
    /** Кнопка сворачивания меню (бургер) */
    toggleButton?: string;
}
/**
 * Inline-стили для элементов навбара
 */
export interface NavBarStyles {
    /** Стили контейнера */
    container?: Record<string, string>;
    /** Стили отдельного пункта меню */
    item?: Record<string, string>;
    /** Стили обертки меню */
    menuWrapper?: Record<string, string>;
    /** Стили кнопки сворачивания */
    toggleButton?: Record<string, string>;
}
/**
 * Классы для отдельного пункта меню
 */
export interface NavBarItemClasses {
    item?: string;
    active?: string;
}
/**
 * Inline-стили для отдельного пункта меню
 */
export interface NavBarItemStyles {
    item?: Record<string, string>;
}
export declare class NavBarComponent {
    /**
     * Элементы меню (текст, иконка, маршрут, бейдж и т.п.)
     */
    menu: HorizontalMenuItem[];
    /**
     * Свёрнутое состояние меню (например, для мобильной версии)
     */
    isCollapsed: boolean;
    /**
     * Кастомные CSS-классы для элементов меню
     */
    customClasses: Partial<NavBarClasses>;
    /**
     * Кастомные inline-стили для элементов меню
     */
    customStyles: Partial<NavBarStyles>;
    /**
     * Событие изменения состояния (свёрнуто/развёрнуто)
     */
    collapsedChange: EventEmitter<boolean>;
    /** Флаг мобильного режима */
    isMobile: boolean;
    constructor();
    /** Отслеживает изменение ширины окна */
    updateScreenSize(): void;
    /** Переключение состояния меню (бургер) */
    toggleCollapse(): void;
    /** Получить стили контейнера меню */
    getMenuStyles(): Record<string, string>;
    /** Получить классы для конкретного пункта меню */
    getItemClasses(item: HorizontalMenuItem): Record<string, boolean | string>;
    /** Получить inline-стили для конкретного пункта */
    getItemStyles(item: HorizontalMenuItem): Record<string, string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NavBarComponent, "lib-nav-bar", never, { "menu": { "alias": "menu"; "required": false; }; "isCollapsed": { "alias": "isCollapsed"; "required": false; }; "customClasses": { "alias": "customClasses"; "required": false; }; "customStyles": { "alias": "customStyles"; "required": false; }; }, { "collapsedChange": "collapsedChange"; }, never, never, true, never>;
}
