import { ElementRef, EventEmitter } from '@angular/core';
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
export declare class SearchFilterSortComponent {
    private elementRef;
    filterField: string;
    filterType: number;
    isVisibleFilter: boolean;
    searchTerm: string;
    selectedFilters: any[];
    sortOrder: 'asc' | 'desc';
    isFilterOpen: boolean;
    filterChange: EventEmitter<FilterDto>;
    sortChange: EventEmitter<SortDto>;
    constructor(elementRef: ElementRef);
    toggleFilter(): void;
    inputWidth: string;
    bgColor: string;
    borderStyle: string;
    isSearchOpen: boolean;
    toggleSearch(isFocused: boolean): void;
    onSearchChange(): void;
    onFilterChange(value: any): void;
    toggleSort(): void;
    resetFilter(): void;
    onClickOutside(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SearchFilterSortComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SearchFilterSortComponent, "app-search-filter-sort", never, { "filterField": { "alias": "filterField"; "required": false; }; "filterType": { "alias": "filterType"; "required": false; }; "isVisibleFilter": { "alias": "isVisibleFilter"; "required": false; }; }, { "filterChange": "filterChange"; "sortChange": "sortChange"; }, never, never, true, never>;
}
export {};
