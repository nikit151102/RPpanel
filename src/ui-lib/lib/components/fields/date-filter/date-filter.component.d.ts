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
export declare class DateFilterSortComponent {
    private elementRef;
    filterField: string;
    selectedFilter: string;
    selectedDate: string;
    dateValue: string;
    startDate: string;
    endDate: string;
    showCalendar: boolean;
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
    onDateChange(): void;
    getDateFilterType(): number;
    formatDateDisplay(): string;
    emitFilterChange(): void;
    openDatePicker(input: HTMLInputElement): void;
    resetFilter(): void;
    onClickOutside(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateFilterSortComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DateFilterSortComponent, "app-date-filter", never, { "filterField": { "alias": "filterField"; "required": false; }; }, { "filterChange": "filterChange"; "sortChange": "sortChange"; }, never, never, true, never>;
}
export {};
