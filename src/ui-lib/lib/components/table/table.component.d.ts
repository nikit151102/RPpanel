import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export interface TableAction {
    label: string;
    icon?: string;
    action: (product: any) => void;
}
export interface ColumnConfig {
    key: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'uuid' | 'enam';
    isFilter: boolean;
    endpoint: string;
    field: string;
}
export interface FilterDto {
    field: string;
    values: any[];
    type: number;
}
export interface SortDto {
    field: string;
    sortType: number;
}
export declare class TableComponent implements OnInit {
    /**
     * Массив объектов, которые будут отображаться в таблице.
     * Каждое значение соответствует одной строке таблицы.
     */
    products: any[];
    /**
     * Конфигурация отображаемых колонок.
     * Ключ — ключ поля, значение — показывать колонку или нет.
     * Пример: { fullName: true, retailPrice: false }
     */
    columnsConfig: {
        [key: string]: boolean;
    };
    /**
     * Настройки всех колонок таблицы.
     * Используется для динамического отображения колонок и фильтров.
     */
    columnOptions: ColumnConfig[];
    /**
     * Количество элементов на странице для пагинации или подгрузки.
     */
    pageSize: number;
    /**
     * Флаг, показывающий, что идет загрузка данных.
     * Используется для отображения индикатора загрузки.
     */
    loading: boolean;
    /**
     * Флаг, показывающий текущий тип отображения таблицы.
     * true — десктопная таблица, false — мобильные карточки.
     */
    isDesktop: boolean;
    /**
     * Домен или контекст, используемый для построения ссылок или API-запросов.
     */
    domain: string;
    /**
     * Массив действий для каждой строки таблицы.
     * Каждое действие имеет label, icon (необязательно) и callback function.
     */
    actions: TableAction[];
    /**
     * Внутренний объект состояния видимости колонок.
     */
    columns: {
        [key: string]: boolean;
    };
    /**
     * Массив выбранных колонок для отображения.
     */
    selectedColumns: string[];
    /**
     * Флаг, показывающий, открыт ли список выбора колонок.
     */
    columnsVisible: boolean;
    /**
     * Текущая страница для подгрузки данных.
     */
    page: number;
    /**
     * Событие на редактирование строки. Эмиттит id продукта.
     */
    edit: EventEmitter<string>;
    /**
     * Событие на удаление строки. Эмиттит id продукта.
     */
    delete: EventEmitter<string>;
    /**
     * Событие для подгрузки следующей страницы данных.
     * Эмиттит объект с номером страницы и размером страницы.
     */
    loadNextPage: EventEmitter<{
        page: number;
        pageSize: number;
    }>;
    /**
     * Событие при изменении фильтра.
     * Эмиттит объект FilterDto с полем, значениями и типом фильтра.
     */
    filterChange: EventEmitter<FilterDto>;
    /**
     * Событие при изменении сортировки.
     * Эмиттит объект SortDto с полем и типом сортировки.
     */
    sortChange: EventEmitter<SortDto>;
    ngOnInit(): void;
    private initializeColumns;
    get filteredSelectedColumns(): string[];
    formatShortDate(date: string): string;
    toggleColVisibility(): void;
    toggleColumnVisibility(columnKey: string, value: boolean): void;
    removeColumn(columnKey: string): void;
    editProduct(id: string): void;
    deleteProduct(id: string): void;
    loadProducts(): void;
    onScroll(): void;
    getColumnLabel(key: string): string;
    objectKeys(obj: any): string[];
    updateScreenSize(): void;
    onFilterChange(filter: any): void;
    queryData: any;
    onSortChange(sort: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TableComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TableComponent, "lib-table", never, { "products": { "alias": "products"; "required": false; }; "columnsConfig": { "alias": "columnsConfig"; "required": false; }; "columnOptions": { "alias": "columnOptions"; "required": false; }; "pageSize": { "alias": "pageSize"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "isDesktop": { "alias": "isDesktop"; "required": false; }; "domain": { "alias": "domain"; "required": false; }; "actions": { "alias": "actions"; "required": false; }; }, { "edit": "edit"; "delete": "delete"; "loadNextPage": "loadNextPage"; "filterChange": "filterChange"; "sortChange": "sortChange"; }, never, never, true, never>;
}
