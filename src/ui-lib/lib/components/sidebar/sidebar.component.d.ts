import { EventEmitter } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import * as i0 from "@angular/core";
interface MenuItem {
    label: string;
    icon: string | SafeHtml;
    active: boolean;
    router: string;
    badge?: string;
    customClasses?: any;
    customStyles?: any;
}
export interface SidebarResponsiveConfig {
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
    widths: {
        mobile: string;
        tablet: string;
        desktop: string;
    };
}
/**
 * Компонент боковой панели (Sidebar) с поддержкой адаптивного поведения.
 *
 * Используется для отображения меню с иконками, бейджами, кнопкой сворачивания,
 * логотипом и кастомными стилями. Адаптивен для мобильных, планшетов и десктопов.
 *
 * Пример использования:
 * ```html
 * <lib-sidebar
 *   [menu]="menuItems"
 *   [logoUrl]="'assets/logo.png'"
 *   [customClasses]="customClasses"
 *   [customStyles]="customStyles"
 *   [responsiveConfig]="responsiveConfig"
 *   (collapsedChange)="onCollapsedChange($event)">
 * </lib-sidebar>
 * ```
 */
export declare class SidebarComponent {
    /**
   * Массив элементов меню для sidebar.
   * Каждый элемент содержит label, icon, router, badge и кастомные стили/классы.
   */
    menu: MenuItem[];
    /**
     * Флаг свёрнутости sidebar.
     * На мобильных устройствах может меняться автоматически.
     */
    isCollapsed: boolean;
    /**
     * URL логотипа, отображаемого в заголовке sidebar
     */
    logoUrl: string;
    /**
     * Кастомные CSS-классы для элементов sidebar (sidebar, header, toggleButton и т.д.)
     */
    customClasses: any;
    /**
     * Кастомные CSS-стили для элементов sidebar (sidebar, header, toggleButton и т.д.)
     */
    customStyles: any;
    /**
     * Конфигурация адаптивности sidebar
     */
    responsiveConfig: SidebarResponsiveConfig;
    /**
     * Событие, генерируемое при изменении состояния свёрнутости sidebar
     */
    collapsedChange: EventEmitter<boolean>;
    currentWidth: string;
    isMiniSidebar: boolean;
    constructor();
    getSidebarStyles(): any;
    getToggleButtonStyles(): any;
    get toggleButtonClasses(): any;
    onResize(): void;
    updateSidebarWidth(): void;
    get isDesktop(): boolean;
    toggleCollapse(): void;
    getItemClasses(item: MenuItem): any;
    getItemStyles(item: MenuItem): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<SidebarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SidebarComponent, "lib-sidebar", never, { "menu": { "alias": "menu"; "required": false; }; "isCollapsed": { "alias": "isCollapsed"; "required": false; }; "logoUrl": { "alias": "logoUrl"; "required": false; }; "customClasses": { "alias": "customClasses"; "required": false; }; "customStyles": { "alias": "customStyles"; "required": false; }; "responsiveConfig": { "alias": "responsiveConfig"; "required": false; }; }, { "collapsedChange": "collapsedChange"; }, never, never, true, never>;
}
export {};
