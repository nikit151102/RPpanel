import { OnChanges, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export interface HeatMapData {
    labelX: string;
    values: number[];
}
export declare class HeatMapComponent implements OnChanges {
    /** Подписи оси X (например: часы) */
    labelsX: string[];
    /** Подписи оси Y (например: дни недели) */
    labelsY: string[];
    /** Данные: массив строк по Y, каждая строка содержит значения по X */
    data: number[][];
    /** Цветовая палитра: от минимального к максимальному */
    colors: string[];
    /** Максимальное значение для нормализации */
    maxValue: number;
    ngOnChanges(changes: SimpleChanges): void;
    /** Возвращает цвет ячейки в зависимости от значения */
    getCellColor(value: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<HeatMapComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HeatMapComponent, "lib-heat-map", never, { "labelsX": { "alias": "labelsX"; "required": false; }; "labelsY": { "alias": "labelsY"; "required": false; }; "data": { "alias": "data"; "required": false; }; "colors": { "alias": "colors"; "required": false; }; }, {}, never, never, true, never>;
}
