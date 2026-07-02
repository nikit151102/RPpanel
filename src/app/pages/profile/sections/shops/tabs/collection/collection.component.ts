import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CashCollectionService, FilterType, Filter, SortOption } from './cash-collection.service';

interface CashCollectionAct {
  id: string;
  dateTime: string;
  amount: number;
  responsibleName: string;
  usNumber: string;
  cashRegister: CashRegister | null;
  store: Store | null;
  isIncorrect?: boolean;
}

interface CashRegister {
  id: string;
  number: string;
  limitMin: number;
  limitMax: number;
  store: Store;
  cashiers: any[];
}

interface Store {
  id: string;
  name1C: string;
  address: Address;
  code: string;
}

interface Address {
  city: string;
  street: string;
  house: string;
  region?: string;
}

interface StoreGroup {
  storeId: string;
  storeName: string;
  storeCode: string;
  storeAddress: string;
  storeRegion: string;
  cashRegisterNumber: string;
  limitMin: number;
  limitMax: number;
  totalAmount: number;
  actsCount: number;
  acts: CashCollectionAct[];
  isIncorrectData: boolean;
  limitStatus: 'below' | 'within' | 'exceeded';
  fillPercentage: number;
}

interface DateFilter {
  startDate: string;
  endDate: string;
}

interface AmountFilter {
  minAmount: number;
  maxAmount: number;
}

interface Statistics {
  totalAmount: number;
  totalActs: number;
  averageAmount: number;
  storesCount: number;
  incorrectDataCount: number;
  minAmount: number;
  maxAmount: number;
  belowLimitCount: number;
  exceededLimitCount: number;
}

@Component({
  selector: 'app-collection',
  imports: [CommonModule, FormsModule],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent implements OnInit {
  storeGroups: StoreGroup[] = [];
  filteredGroups: StoreGroup[] = [];
  expandedStores: Set<string> = new Set();
  isLoading = true;
  allStores: Store[] = [];
  allActs: CashCollectionAct[] = [];
  
  dateFilter: DateFilter = {
    startDate: '',
    endDate: ''
  };

  amountFilter: AmountFilter = {
    minAmount: 0,
    maxAmount: 0
  };

  searchQuery: string = '';
  sortBy: 'date' | 'amount' | 'name' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  statistics: Statistics = {
    totalAmount: 0,
    totalActs: 0,
    averageAmount: 0,
    storesCount: 0,
    incorrectDataCount: 0,
    minAmount: 0,
    maxAmount: 0,
    belowLimitCount: 0,
    exceededLimitCount: 0
  };

  constructor(private cashCollectionService: CashCollectionService) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      const [stores, acts] = await Promise.all([
        this.cashCollectionService.getStores(),
        this.cashCollectionService.getCashCollectionActs()
      ]);
      
      this.allStores = stores;
      this.allActs = acts;
      this.processAndGroupData(acts);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async applyFilters(): Promise<void> {
    const filters: Filter[] = [];

    // Фильтр по дате
    if (this.dateFilter.startDate && this.dateFilter.endDate) {
      filters.push({
        field: 'dateTime',
        values: [this.dateFilter.startDate, this.dateFilter.endDate],
        type: FilterType.DateBetween
      });
    } else if (this.dateFilter.startDate) {
      filters.push({
        field: 'dateTime',
        values: [this.dateFilter.startDate],
        type: FilterType.DateAfter
      });
    } else if (this.dateFilter.endDate) {
      filters.push({
        field: 'dateTime',
        values: [this.dateFilter.endDate],
        type: FilterType.DateBefore
      });
    }

    // Фильтр по сумме
    if (this.amountFilter.minAmount > 0 || this.amountFilter.maxAmount > 0) {
      if (this.amountFilter.minAmount > 0 && this.amountFilter.maxAmount > 0) {
        filters.push({
          field: 'amount',
          values: [this.amountFilter.minAmount, this.amountFilter.maxAmount],
          type: FilterType.Between
        });
      } else if (this.amountFilter.minAmount > 0) {
        filters.push({
          field: 'amount',
          values: [this.amountFilter.minAmount],
          type: FilterType.GreaterThan
        });
      } else if (this.amountFilter.maxAmount > 0) {
        filters.push({
          field: 'amount',
          values: [this.amountFilter.maxAmount],
          type: FilterType.LessThan
        });
      }
    }

    // Поиск по ответственному
    if (this.searchQuery.trim()) {
      filters.push({
        field: 'responsibleName',
        values: [this.searchQuery.trim()],
        type: FilterType.Contains
      });
    }

    // Сортировка
    const sorts: SortOption[] = [];
    const sortField = this.sortBy === 'date' ? 'dateTime' : this.sortBy === 'amount' ? 'amount' : 'responsibleName';
    sorts.push({
      field: sortField,
      sortType: this.sortDirection === 'asc' ? 0 : 1
    });

    try {
      const acts = await this.cashCollectionService.getCashCollectionActs(filters, sorts);
      this.allActs = acts;
      this.processAndGroupData(acts);
    } catch (error) {
      console.error('Ошибка применения фильтров:', error);
    }
  }

  resetFilters(): void {
    this.dateFilter = { startDate: '', endDate: '' };
    this.amountFilter = { minAmount: 0, maxAmount: 0 };
    this.searchQuery = '';
    this.sortBy = 'date';
    this.sortDirection = 'desc';
    this.loadData();
  }

  private processAndGroupData(acts: CashCollectionAct[]): void {
    // Создаем маппинг: responsibleName -> store
    const nameToStoreMap = new Map<string, Store>();
    
    acts.forEach(act => {
      if (act.store) {
        nameToStoreMap.set(act.responsibleName, act.store);
      }
    });

    // Присваиваем магазин записям без него, если ФИО совпадает
    acts.forEach(act => {
      if (!act.store && nameToStoreMap.has(act.responsibleName)) {
        const store = nameToStoreMap.get(act.responsibleName);
        if (store !== undefined) {
          act.store = store;
          act.isIncorrect = true;
        }
      }
    });

    // Группируем по магазинам
    const groupsMap = new Map<string, StoreGroup>();

    acts.forEach(act => {
      if (!act.store) {
        const key = 'no-store';
        if (!groupsMap.has(key)) {
          groupsMap.set(key, {
            storeId: key,
            storeName: 'Без магазина',
            storeCode: '',
            storeAddress: '',
            storeRegion: '',
            cashRegisterNumber: '',
            limitMin: 0,
            limitMax: 0,
            totalAmount: 0,
            actsCount: 0,
            acts: [],
            isIncorrectData: false,
            limitStatus: 'within',
            fillPercentage: 0
          });
        }
        const group = groupsMap.get(key);
        if (group) {
          group.acts.push(act);
          group.actsCount++;
          group.totalAmount += act.amount;
          if (act.isIncorrect) group.isIncorrectData = true;
        }
      } else {
        const store = act.store;
        const key = store.id;

        if (!groupsMap.has(key)) {
          const limitMin = act.cashRegister ? act.cashRegister.limitMin : 0;
          const limitMax = act.cashRegister ? act.cashRegister.limitMax : 0;
          const cashRegisterNumber = act.cashRegister ? act.cashRegister.number : '';

          groupsMap.set(key, {
            storeId: key,
            storeName: store.name1C || `Магазин ${store.code}`,
            storeCode: store.code,
            storeAddress: this.formatAddress(store.address),
            storeRegion: store.address.region || '',
            cashRegisterNumber: cashRegisterNumber,
            limitMin: limitMin,
            limitMax: limitMax,
            totalAmount: 0,
            actsCount: 0,
            acts: [],
            isIncorrectData: false,
            limitStatus: 'within',
            fillPercentage: 0
          });
        }

        const group = groupsMap.get(key);
        if (group) {
          group.acts.push(act);
          group.actsCount++;
          group.totalAmount += act.amount;
          if (act.isIncorrect) group.isIncorrectData = true;
        }
      }
    });

    // Рассчитываем процент заполнения и статус лимита
    groupsMap.forEach(group => {
      if (group.limitMax > 0) {
        group.fillPercentage = Math.min((group.totalAmount / group.limitMax) * 100, 100);
        
        if (group.limitMin > 0 && group.limitMax > 0) {
          if (group.totalAmount < group.limitMin) {
            group.limitStatus = 'below';
          } else if (group.totalAmount > group.limitMax) {
            group.limitStatus = 'exceeded';
          } else {
            group.limitStatus = 'within';
          }
        }
      }
    });

    this.storeGroups = Array.from(groupsMap.values()).sort((a, b) => 
      a.storeName.localeCompare(b.storeName)
    );

    this.filteredGroups = [...this.storeGroups];
    this.calculateStatistics(acts);
  }

  private calculateStatistics(acts: CashCollectionAct[]): void {
    if (acts.length === 0) {
      this.statistics = {
        totalAmount: 0,
        totalActs: 0,
        averageAmount: 0,
        storesCount: 0,
        incorrectDataCount: 0,
        minAmount: 0,
        maxAmount: 0,
        belowLimitCount: 0,
        exceededLimitCount: 0
      };
      return;
    }

    const amounts = acts.map(act => act.amount);
    const incorrectActs = acts.filter(act => act.isIncorrect);
    const belowLimit = this.storeGroups.filter(g => g.limitStatus === 'below');
    const exceededLimit = this.storeGroups.filter(g => g.limitStatus === 'exceeded');

    this.statistics = {
      totalAmount: amounts.reduce((sum, amount) => sum + amount, 0),
      totalActs: acts.length,
      averageAmount: amounts.reduce((sum, amount) => sum + amount, 0) / acts.length,
      storesCount: this.storeGroups.filter(g => g.storeId !== 'no-store').length,
      incorrectDataCount: incorrectActs.length,
      minAmount: Math.min(...amounts),
      maxAmount: Math.max(...amounts),
      belowLimitCount: belowLimit.length,
      exceededLimitCount: exceededLimit.length
    };
  }

  private formatAddress(address: Address): string {
    if (!address) return '';
    return `${address.city}, ${address.street}, ${address.house}`;
  }

  toggleStore(storeId: string): void {
    if (this.expandedStores.has(storeId)) {
      this.expandedStores.delete(storeId);
    } else {
      this.expandedStores.add(storeId);
    }
  }

  isExpanded(storeId: string): boolean {
    return this.expandedStores.has(storeId);
  }

  getLimitStatusText(status: string): string {
    switch (status) {
      case 'below': return 'Ниже минимума';
      case 'within': return 'В пределах нормы';
      case 'exceeded': return 'Превышен максимум';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('ru-RU') + ' ₽';
  }

  getFillPercentageColor(percentage: number): string {
    if (percentage < 30) return '#ffa500';
    if (percentage < 70) return '#327120';
    if (percentage < 100) return '#ff9800';
    return '#dc3545';
  }
}