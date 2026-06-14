import { OnInit } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastMessage, ToastClasses, ToastStyles, ToastType } from './toast.model';
import * as i0 from "@angular/core";
export declare class ToastComponent implements OnInit {
    private toastService;
    toasts: ToastMessage[];
    /** Кастомные CSS-классы */
    customClasses: Partial<ToastClasses>;
    /** Кастомные inline-стили */
    customStyles: Partial<ToastStyles>;
    /** Позиция уведомлений */
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    constructor(toastService: ToastService);
    ngOnInit(): void;
    /** Закрыть уведомление вручную */
    closeToast(toast: ToastMessage): void;
    /** Цвет по типу */
    getToastColor(type?: ToastType): string;
    /** Иконка по типу */
    getDefaultIcon(type?: ToastType): string;
    /** Стили контейнера с поддержкой позиции */
    getContainerStyles(): {
        top: string;
        left: string;
        right?: undefined;
        bottom?: undefined;
        position: string;
        display: string;
        flexDirection: string;
        gap: string;
        zIndex: string;
        padding: string;
    } | {
        top: string;
        right: string;
        left?: undefined;
        bottom?: undefined;
        position: string;
        display: string;
        flexDirection: string;
        gap: string;
        zIndex: string;
        padding: string;
    } | {
        bottom: string;
        left: string;
        top?: undefined;
        right?: undefined;
        position: string;
        display: string;
        flexDirection: string;
        gap: string;
        zIndex: string;
        padding: string;
    } | {
        bottom: string;
        right: string;
        top?: undefined;
        left?: undefined;
        position: string;
        display: string;
        flexDirection: string;
        gap: string;
        zIndex: string;
        padding: string;
    };
    /** Стили одного уведомления */
    getToastStyles(toast: ToastMessage): {
        background: string;
        color: string;
        borderLeft: string;
        borderRadius: string;
        padding: string;
        minWidth: string;
        boxShadow: string;
        display: string;
        alignItems: string;
        justifyContent: string;
    };
    /** Позиционирование контейнера */
    private getPositionStyles;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToastComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ToastComponent, "lib-toast", never, { "customClasses": { "alias": "customClasses"; "required": false; }; "customStyles": { "alias": "customStyles"; "required": false; }; "position": { "alias": "position"; "required": false; }; }, {}, never, never, true, never>;
}
