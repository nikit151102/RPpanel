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
export declare class NumberFilterComponent {
    private elementRef;
    filterField: string;
    selectedFilter: string;
    selectedNumber: string;
    numberValue: number;
    startNumber: number;
    endNumber: number;
    showNumberInput: boolean;
    isFilterOpen: boolean;
    sortOrder: 'asc' | 'desc';
    filterChange: EventEmitter<FilterDto>;
    sortChange: EventEmitter<SortDto>;
    constructor(elementRef: ElementRef);
    toggleFilter(): void;
    inputWidth: string;
    bgColor: string;
    borderStyle: string;
    isSearchOpen: boolean;
    toggleSearch(isFocused: boolean): void;
    toggleSort(): void;
    onFilterChange(filter: string): void;
    onSearchChange(): void;
    onNumberChange(): void;
    getNumberFilterType(): number;
    formatNumberDisplay(): string;
    emitFilterChange(): void;
    openNumberPicker(input: HTMLInputElement): void;
    resetFilter(): void;
    onClickOutside(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NumberFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NumberFilterComponent, "app-number-filter", never, { "filterField": { "alias": "filterField"; "required": false; }; }, { "filterChange": "filterChange"; "sortChange": "sortChange"; }, never, never, true, never>;
}
export {};
