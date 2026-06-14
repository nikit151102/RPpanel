import { SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class GaugeComponent {
    /** Текущее значение */
    value: number;
    /** Минимальное значение */
    min: number;
    /** Максимальное значение */
    max: number;
    /** Цвет заполненной части */
    color: string;
    /** Цвет фона */
    backgroundColor: string;
    /** Размер индикатора */
    size: number;
    /** Толщина линии */
    strokeWidth: number;
    /** Плавная анимация */
    animate: boolean;
    /** Текущее значение для анимации */
    displayedValue: number;
    /** Радиус круга */
    radius: number;
    /** Длина окружности */
    circumference: number;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    private updateValue;
    getStrokeDashOffset(): number;
    getPercent(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<GaugeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GaugeComponent, "lib-gauge", never, { "value": { "alias": "value"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; "color": { "alias": "color"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "size": { "alias": "size"; "required": false; }; "strokeWidth": { "alias": "strokeWidth"; "required": false; }; "animate": { "alias": "animate"; "required": false; }; }, {}, never, never, true, never>;
}
