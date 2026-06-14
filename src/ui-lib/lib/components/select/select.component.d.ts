import { ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export interface SelectOption {
    label: string;
    value: any;
}
export declare class SelectComponent implements ControlValueAccessor {
    private el;
    options: SelectOption[];
    placeholder: string;
    multiple: boolean;
    searchEnabled: boolean;
    value: any;
    showDropdown: boolean;
    searchTerm: string;
    private onChange;
    private onTouched;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    toggleDropdown(): void;
    getSelectedLabels(): string;
    getSelectedLabel(): string;
    selectOption(option: SelectOption): void;
    isSelected(option: SelectOption): boolean;
    get filteredOptions(): SelectOption[];
    onClickOutside(target: HTMLElement): void;
    constructor(el: ElementRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SelectComponent, "lib-select", never, { "options": { "alias": "options"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "searchEnabled": { "alias": "searchEnabled"; "required": false; }; }, {}, never, never, true, never>;
}
