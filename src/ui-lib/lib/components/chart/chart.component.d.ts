import { AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import * as i0 from "@angular/core";
export interface ChartDataSet {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
}
export interface ChartData {
    labels: string[];
    datasets: ChartDataSet[];
}
export declare class ChartComponent implements OnChanges, AfterViewInit {
    canvas: any;
    /** Тип графика: 'line', 'bar', 'pie', 'doughnut' */
    type: ChartType;
    /** Данные графика */
    data: ChartData;
    /** Опции Chart.js */
    options: ChartConfiguration['options'];
    chart: Chart;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private initChart;
    private updateChart;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChartComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChartComponent, "lib-chart", never, { "type": { "alias": "type"; "required": false; }; "data": { "alias": "data"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, {}, never, never, true, never>;
}
