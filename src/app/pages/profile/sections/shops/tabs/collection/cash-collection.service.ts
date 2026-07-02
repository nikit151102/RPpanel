import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export enum FilterType {
  Contains = 0,           // Поиск по подстроке
  EnumIn = 1,            // Перечисление: значение входит в список
  Equal = 2,             // Точное равенство
  LessThan = 3,          // Строго меньше
  GreaterThan = 4,       // Строго больше
  Between = 5,           // Диапазон значений включительно
  DateEqual = 6,         // Равенство по дате
  DateBefore = 7,        // Строго раньше указанной границы
  DateAfter = 8,         // Строго позже указанной границы
  DateBetween = 9,       // Диапазон дат включительно
  GuidIn = 10,           // GUID: значение входит в список
  CollectionAny = 11,    // Коллекция: есть элемент с нужным Id
  BooleanEqual = 12      // Boolean: точное совпадение
}

export interface Filter {
  field: string;
  values: (string | number | boolean | null)[];
  type: FilterType;
}

export interface SortOption {
  field: string;
  sortType: 0 | 1; // 0 - Asc, 1 - Desc
}

@Injectable({
  providedIn: 'root'
})
export class CashCollectionService {
  private apiUrl = 'https://рп.пакетон.рф/shops/api/Entities/CashCollectionAct/Filter';
  private storesUrl = 'https://рп.пакетон.рф/shops/api/Entities/Store/Filter';

  constructor(private http: HttpClient) {}

  async getCashCollectionActs(
    filters: Filter[] = [], 
    sorts: SortOption[] = [],
    page: number = 0, 
    pageSize: number = 1000
  ): Promise<any[]> {
    const requestBody = {
      filters: filters,
      sorts: sorts,
      page: page,
      pageSize: pageSize
    };

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        })
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      throw error;
    }
  }

  async getStores(): Promise<any[]> {
    const requestBody = {
      filters: [],
      sorts: [],
      page: 0,
      pageSize: 1000
    };

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.storesUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        })
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении магазинов:', error);
      throw error;
    }
  }
}