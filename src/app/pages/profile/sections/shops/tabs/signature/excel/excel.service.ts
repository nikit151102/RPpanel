import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { TableHeaderConfig, TableData, ExcelExportConfig } from './excel.interface';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private defaultHeaderConfig: TableHeaderConfig = {
    columns: [
      { header: 'Город', width: 14 },
      { header: 'Наименование подразделения', width: 25 },
      { header: 'Плановые показатели', width: 15 },
      { header: 'ФИО', width: 25 },
      { header: 'Подпись', width: 30 }
    ],
    mergedCells: ['A1:A2', 'B1:B2', 'C1:C2', 'D1:E1']
  };

  private defaultPageSetup: Partial<ExcelJS.PageSetup> = {
    paperSize: 9,
    orientation: 'portrait',
    fitToPage: true,
    fitToHeight: 1,
    fitToWidth: 1,
    margins: {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3
    }
  };

  /**
   * Создает Excel файл с таблицей данных и подписями
   */
  async createExcelWithSignatures(
    data: TableData[],
    signatureDataURLs: string[] = [],
    config: ExcelExportConfig = {}
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(config.sheetName || 'Документ с подписями');

    // Настройка страницы
    worksheet.pageSetup = { ...this.defaultPageSetup, ...config.pageSetup };

    // Создание шапки таблицы
    this.createTableHeader(worksheet, this.defaultHeaderConfig);

    // Добавление данных
    await this.addMultipleTableData(worksheet, workbook, data, signatureDataURLs);

    // Сохранение файла
    const buffer = await workbook.xlsx.writeBuffer();
    this.saveExcelFile(buffer, config.fileName || `document_${new Date().getTime()}.xlsx`);
  }

  /**
   * Создает шапку таблицы
   */
  private createTableHeader(worksheet: ExcelJS.Worksheet, config: TableHeaderConfig): void {
    // Установка ширины колонок
    worksheet.columns = config.columns.map((col: any) => ({
      width: col.width
    }));

    // Объединение ячеек
    if (config.mergedCells) {
      config.mergedCells.forEach((mergeRange: any) => {
        worksheet.mergeCells(mergeRange);
      });
    }

    // Заголовки для объединенных ячеек
    worksheet.getCell('A1').value = 'Город';
    worksheet.getCell('B1').value = 'Наименование подразделения';
    worksheet.getCell('C1').value = 'Плановые показатели';
    worksheet.getCell('D1').value = 'Начальник обособленного подразделения (ознакомлен)';

    // Подзаголовки для второй строки
    worksheet.getCell('D2').value = 'ФИО';
    worksheet.getCell('E2').value = 'Подпись';

    // Стиль для шапки
    const headerStyle = {
      font: { bold: true, color: { argb: '101010' }, size: 12 },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' }
      },
      alignment: {
        horizontal: 'center' as ExcelJS.Alignment['horizontal'],
        vertical: 'middle' as ExcelJS.Alignment['vertical'],
        wrapText: true
      },
      border: {
        top: { style: 'thin' as ExcelJS.BorderStyle },
        left: { style: 'thin' as ExcelJS.BorderStyle },
        bottom: { style: 'thin' as ExcelJS.BorderStyle },
        right: { style: 'thin' as ExcelJS.BorderStyle }
      }
    };

    // Применяем стили ко всем ячейкам шапки
    ['A1', 'B1', 'C1', 'D1', 'D2', 'E2'].forEach(cellAddress => {
      const cell = worksheet.getCell(cellAddress);
      Object.assign(cell, headerStyle);
    });

    // Настройка высоты строк
    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 25;
  }

  /**
   * Добавляет несколько строк данных в таблицу
   */
  private async addMultipleTableData(
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    data: TableData[],
    signatureDataURLs: string[] = []
  ): Promise<void> {
    
    let currentRow = 3; // Начинаем с 3 строки (после шапки)

    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      const signatureDataURL = signatureDataURLs[i] || '';

      await this.addTableData(worksheet, workbook, rowData, currentRow, signatureDataURL);
      currentRow++;
    }
  }

  /**
   * Добавляет одну строку данных в таблицу
   */
  private async addTableData(
    worksheet: ExcelJS.Worksheet,
    workbook: ExcelJS.Workbook,
    data: TableData,
    rowNumber: number,
    signatureDataURL: string = ''
  ): Promise<void> {

    const dataRow = worksheet.getRow(rowNumber);

    // Заполняем данные из объекта
    dataRow.values = [
      data.city,
      data.shopAddress,
      data.amount,
      data.managerName,
      data.signatureNote || ''
    ];

    // Стили для строки с данными
    dataRow.font = { size: 11 };
    dataRow.alignment = {
      vertical: 'middle' as ExcelJS.Alignment['vertical'],
      wrapText: true
    };
    dataRow.height = 50;

    // Получаем адреса ячеек для текущей строки
    const cellAddresses = [
      `A${rowNumber}`, `B${rowNumber}`, `C${rowNumber}`, `D${rowNumber}`, `E${rowNumber}`
    ];

    // Границы для всех ячеек
    cellAddresses.forEach(cellAddress => {
      const cell = worksheet.getCell(cellAddress);
      cell.border = {
        top: { style: 'thin' as ExcelJS.BorderStyle },
        left: { style: 'thin' as ExcelJS.BorderStyle },
        bottom: { style: 'thin' as ExcelJS.BorderStyle },
        right: { style: 'thin' as ExcelJS.BorderStyle }
      };
    });

    // Добавление подписи
    try {
      if (signatureDataURL) {
        const imageBuffer = this.dataURLToArrayBuffer(signatureDataURL);
        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: 'png',
        });

        worksheet.addImage(imageId, `E${rowNumber}:E${rowNumber}`);
      }
    } catch (error) {
      console.error('Ошибка при вставке изображения:', error);
      worksheet.getCell(`E${rowNumber}`).value = data.signatureNote || 'Подпись в отдельном файле';
    }

    // Настройка выравнивания
    const alignments: Array<{
      cell: string;
      alignment: Partial<ExcelJS.Alignment>;
    }> = [
      {
        cell: `A${rowNumber}`,
        alignment: {
          vertical: 'middle' as ExcelJS.Alignment['vertical'],
          horizontal: 'left' as ExcelJS.Alignment['horizontal'],
          wrapText: true
        }
      },
      {
        cell: `B${rowNumber}`,
        alignment: {
          vertical: 'middle' as ExcelJS.Alignment['vertical'],
          horizontal: 'left' as ExcelJS.Alignment['horizontal'],
          wrapText: true
        }
      },
      {
        cell: `C${rowNumber}`,
        alignment: {
          vertical: 'middle' as ExcelJS.Alignment['vertical'],
          horizontal: 'center' as ExcelJS.Alignment['horizontal'],
          wrapText: true
        }
      },
      {
        cell: `D${rowNumber}`,
        alignment: {
          vertical: 'middle' as ExcelJS.Alignment['vertical'],
          horizontal: 'center' as ExcelJS.Alignment['horizontal'],
          wrapText: true
        }
      },
      {
        cell: `E${rowNumber}`,
        alignment: {
          vertical: 'middle' as ExcelJS.Alignment['vertical'],
          horizontal: 'center' as ExcelJS.Alignment['horizontal'],
          wrapText: true
        }
      }
    ];

    alignments.forEach(({ cell, alignment }) => {
      worksheet.getCell(cell).alignment = alignment;
    });
  }

  /**
   * Преобразует DataURL в ArrayBuffer
   */
  private dataURLToArrayBuffer(dataURL: string): ArrayBuffer {
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  }

  /**
   * Сохраняет Excel файл
   */
  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
    }, 100);
  }
  
  /**
   * Создает кастомную таблицу с пользовательской конфигурацией
   */
  async createCustomExcel(
    data: TableData[],
    headerConfig: TableHeaderConfig,
    signatureDataURLs: string[] = [],
    config: ExcelExportConfig = {}
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(config.sheetName || 'Кастомный документ');

    worksheet.pageSetup = { ...this.defaultPageSetup, ...config.pageSetup };

    // Используем пользовательскую конфигурацию шапки
    this.createTableHeader(worksheet, headerConfig);

    // Добавляем данные
    await this.addMultipleTableData(worksheet, workbook, data, signatureDataURLs);

    const buffer = await workbook.xlsx.writeBuffer();
    this.saveExcelFile(buffer, config.fileName || `custom_document_${new Date().getTime()}.xlsx`);
  }
}


