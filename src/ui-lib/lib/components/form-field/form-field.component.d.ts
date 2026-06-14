import { FormControl } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class FormFieldComponent {
    /** Лейбл поля */
    label: string;
    /** Placeholder */
    placeholder: string;
    /** Иконка слева или справа */
    iconLeft?: string;
    iconRight?: string;
    /** Тип input */
    type: string;
    /** FormControl из reactive forms */
    control: FormControl;
    /** Дополнительный класс */
    customClass: string;
    /** Проверка видимости ошибок */
    get showError(): boolean;
    /** Возвращает первую ошибку */
    get errorMessage(): string | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FormFieldComponent, "lib-form-field", never, { "label": { "alias": "label"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "iconLeft": { "alias": "iconLeft"; "required": false; }; "iconRight": { "alias": "iconRight"; "required": false; }; "type": { "alias": "type"; "required": false; }; "control": { "alias": "control"; "required": false; }; "customClass": { "alias": "customClass"; "required": false; }; }, {}, never, never, true, never>;
}
