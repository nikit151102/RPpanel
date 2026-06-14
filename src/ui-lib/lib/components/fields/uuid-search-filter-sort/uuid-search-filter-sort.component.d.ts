import { ElementRef, EventEmitter } from '@angular/core';
import { UuidSearchFilterSortService } from './uuid-search-filter-sort.service';
import * as i0 from "@angular/core";
interface FilterDto {
    field?: string;
    values?: any[];
    type?: number;
}
interface SortDto {
    field?: string;
    sortType: number;
}
export declare class UuidSearchFilterSortComponent {
    private uuidSearchFilterSortService;
    private elementRef;
    filterField: string;
    filterType: number;
    searchField: string;
    apiEndpoint: string;
    fieldNames: string;
    Field: string;
    enam: any;
    domain: string;
    searchTerm: string;
    selectedFilters: any[];
    sortOrder: 'asc' | 'desc';
    isFilterOpen: boolean;
    filterChange: EventEmitter<FilterDto>;
    sortChange: EventEmitter<SortDto>;
    products: any[];
    endpointDataLoaded: boolean;
    constructor(uuidSearchFilterSortService: UuidSearchFilterSortService, elementRef: ElementRef);
    inputWidth: string;
    bgColor: string;
    borderStyle: string;
    isSearchOpen: boolean;
    toggleSearch(isFocused: boolean): void;
    ngOnChanges(): void;
    loadData(): void;
    toggleFilter(): void;
    onSearchChange(): void;
    onFilterChange(id: number): void;
    toggleSort(): void;
    getDisplayText(field: string): string;
    resetFilter(): void;
    onClickOutside(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UuidSearchFilterSortComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UuidSearchFilterSortComponent, "app-uuid-search-filter-sort", never, { "filterField": { "alias": "filterField"; "required": false; }; "filterType": { "alias": "filterType"; "required": false; }; "searchField": { "alias": "searchField"; "required": false; }; "apiEndpoint": { "alias": "apiEndpoint"; "required": false; }; "fieldNames": { "alias": "fieldNames"; "required": false; }; "Field": { "alias": "Field"; "required": false; }; "enam": { "alias": "enam"; "required": false; }; "domain": { "alias": "domain"; "required": false; }; }, { "filterChange": "filterChange"; "sortChange": "sortChange"; }, never, never, true, never>;
}
export {};
