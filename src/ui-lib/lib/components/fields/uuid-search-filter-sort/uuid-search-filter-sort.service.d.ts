import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class UuidSearchFilterSortService {
    private http;
    domain: string;
    private cache;
    constructor(http: HttpClient);
    getProductsByEndpoint(endpoint: string): Observable<any[]>;
    clearCacheForEndpoint(endpoint: string): void;
    clearAllCache(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UuidSearchFilterSortService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UuidSearchFilterSortService>;
}
