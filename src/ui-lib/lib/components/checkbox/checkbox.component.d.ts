import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class CheckboxComponent implements ControlValueAccessor {
    label: string;
    disabled: boolean;
    checked: boolean;
    private onChange;
    private onTouched;
    toggle(): void;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CheckboxComponent, "lib-checkbox", never, { "label": { "alias": "label"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, true, never>;
}
