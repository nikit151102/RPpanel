import * as i0 from "@angular/core";
export declare class ProgressBarComponent {
    /** Показывать плавную анимацию заполнения */
    animate: boolean;
    /** Пульсация фона */
    pulse: boolean;
    /** Градиентное движение */
    gradient: boolean;
    /** Включить анимацию появления при монтировании */
    fadeInOnInit: boolean;
    /** Длительность анимации появления в миллисекундах */
    fadeInDuration: number;
    /** Текущее значение прогресса */
    value: number;
    /** Максимальное значение прогресса */
    max: number;
    /** Цвет заполненной части */
    color: string;
    /** Цвет фона полосы */
    backgroundColor: string;
    /** Высота полосы */
    height: string;
    /** Закругление углов */
    borderRadius: string;
    /** Показывать текст прогресса */
    showLabel: boolean;
    /** Формат текста, если showLabel = true */
    labelTemplate: 'percent' | 'fraction' | 'custom';
    /** Пользовательский текст, если labelTemplate = 'custom' */
    customLabel: string;
    /** Локальное значение для анимации появления */
    progressValue: number;
    /** Флаг для CSS-класса fade-in */
    fadeInActive: boolean;
    ngOnInit(): void;
    getProgress(): number;
    getLabel(): string;
    getWrapperStyles(): {
        backgroundColor: string;
        borderRadius: string;
        height: string;
        overflow: string;
        width: string;
    };
    getBarStyles(): {
        width: string;
        backgroundColor: string;
        height: string;
        borderRadius: string;
        transition: string;
        display: string;
        alignItems: string;
        justifyContent: string;
        color: string;
        fontWeight: string;
        fontSize: string;
        opacity: number;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<ProgressBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProgressBarComponent, "lib-progress-bar", never, { "animate": { "alias": "animate"; "required": false; }; "pulse": { "alias": "pulse"; "required": false; }; "gradient": { "alias": "gradient"; "required": false; }; "fadeInOnInit": { "alias": "fadeInOnInit"; "required": false; }; "fadeInDuration": { "alias": "fadeInDuration"; "required": false; }; "value": { "alias": "value"; "required": false; }; "max": { "alias": "max"; "required": false; }; "color": { "alias": "color"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "height": { "alias": "height"; "required": false; }; "borderRadius": { "alias": "borderRadius"; "required": false; }; "showLabel": { "alias": "showLabel"; "required": false; }; "labelTemplate": { "alias": "labelTemplate"; "required": false; }; "customLabel": { "alias": "customLabel"; "required": false; }; }, {}, never, never, true, never>;
}
