import * as ExcelJS from 'exceljs';

export interface TableData {
  city: string;
  shopAddress: string;
  amount: number;
  managerName: string;
  signatureNote?: string;
}

export interface ExcelExportConfig {
  fileName?: string;
  sheetName?: string;
  pageSetup?: Partial<ExcelJS.PageSetup>;
}

export interface TableHeaderConfig {
  columns: Array<{
    header: string;
    width: number;
    alignment?: Partial<ExcelJS.Alignment>;
  }>;
  mergedCells?: string[];
}