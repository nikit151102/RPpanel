import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TooltipComponent {
    private el;
    /** Текст или HTML контент для тултипа */
    content: string;
    /** Позиция тултипа */
    position: 'top' | 'bottom' | 'left' | 'right';
    /** Задержка перед появлением */
    showDelay: number;
    /** Задержка перед скрытием */
    hideDelay: number;
    /** Максимальная ширина */
    maxWidth: string;
    /** Флаг видимости */
    visible: boolean;
    private showTimeout?;
    private hideTimeout?;
    constructor(el: ElementRef);
    onMouseEnter(): void;
    onMouseLeave(): void;
    /** Класс для позиционирования */
    getPositionClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TooltipComponent, "lib-tooltip", never, { "content": { "alias": "content"; "required": false; }; "position": { "alias": "position"; "required": false; }; "showDelay": { "alias": "showDelay"; "required": false; }; "hideDelay": { "alias": "hideDelay"; "required": false; }; "maxWidth": { "alias": "maxWidth"; "required": false; }; }, {}, never, ["*"], true, never>;
}
