import * as i0 from "@angular/core";
export interface TimelineEvent {
    date?: string;
    title: string;
    description?: string;
    icon?: string;
    color?: string;
}
export declare class TimelineComponent {
    /** Список событий */
    events: TimelineEvent[];
    /** Вертикальная или горизонтальная ориентация */
    orientation: 'vertical' | 'horizontal';
    /** Цвет линии по умолчанию */
    lineColor: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimelineComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimelineComponent, "lib-timeline", never, { "events": { "alias": "events"; "required": false; }; "orientation": { "alias": "orientation"; "required": false; }; "lineColor": { "alias": "lineColor"; "required": false; }; }, {}, never, never, true, never>;
}
