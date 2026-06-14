import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class TimePickerComponent implements ControlValueAccessor {
    private el;
    placeholder: string;
    minHour: number;
    maxHour: number;
    stepMinutes: number;
    value: {
        hours: number;
        minutes: number;
    } | null;
    showPicker: boolean;
    private onChange;
    private onTouched;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    togglePicker(): void;
    selectHour(hour: number): void;
    selectMinute(minute: number): void;
    get hours(): number[];
    get minutes(): number[];
    displayValue(): string;
    onClickOutside(target: HTMLElement): void;
    constructor(el: ElementRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<TimePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimePickerComponent, "lib-time-picker", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "minHour": { "alias": "minHour"; "required": false; }; "maxHour": { "alias": "maxHour"; "required": false; }; "stepMinutes": { "alias": "stepMinutes"; "required": false; }; }, {}, never, never, true, never>;
}
