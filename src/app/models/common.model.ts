export interface ApiResponse<T> {
  message: string;
  status: number;
  pageCount: number;
  totalCount: number;
  page: number;
  pageSize: number;
  data: T[];
  breadCrumbs: any[];
  result: any;
}

export interface FilterDto {
  field: string;
  values: string[];
  type: number;
}

export interface QueryDto {
  filters: FilterDto[];
  sorts?: any[];
  page: number;
  pageSize: number;
}