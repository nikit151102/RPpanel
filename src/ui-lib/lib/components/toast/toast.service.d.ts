import { ToastMessage } from './toast.model';
import * as i0 from "@angular/core";
export declare class ToastService {
    private toastsSubject;
    toasts$: import("rxjs").Observable<ToastMessage[]>;
    show(toast: Omit<ToastMessage, 'id'>): void;
    remove(id: string): void;
    success(message: string, title?: string, duration?: number): void;
    error(message: string, title?: string, duration?: number): void;
    info(message: string, title?: string, duration?: number): void;
    warning(message: string, title?: string, duration?: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToastService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ToastService>;
}
