import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { Subject, of, BehaviorSubject } from 'rxjs';
import { IncidentsService } from '../incidents.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incident-dialog',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './incident-dialog.component.html',
  styleUrl: './incident-dialog.component.scss'
})
export class IncidentDialogComponent implements OnInit {
  @Input() isDialogVisible: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() selectedIncident: any = null;
  @Input() reasonTypes: any[] = [];
  @Input() managerUsername: string = '';

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChildren('dropdownContent') dropdownContents!: QueryList<ElementRef>;

  incidentForm: FormGroup;
  filteredProducts: { [key: number]: any[] } = {};
  showDropdown: { [key: number]: boolean } = {};
  searchTerms: { [key: number]: Subject<string> } = {};
  selectedProducts: { [key: number]: any } = {};

  // Пагинация для каждого поля поиска
  pagination: { [key: number]: { page: number, hasMore: boolean, loading: boolean, total: number } } = {};
  private readonly PAGE_SIZE = 20;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentsService
  ) {
    this.incidentForm = this.createForm();
  }

  ngOnInit() {
    if (!this.isEditMode) {
      this.addItem();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
      contractor: [''],
      details: ['', Validators.required],
      reason_type_id: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.incidentForm.get('items') as FormArray;
  }

  addItem() {
    const index = this.items.length;
    this.items.push(this.fb.group({
      product_id: [''],
      product_search: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [0, [Validators.required, Validators.min(0)]],
      is_new_product: [false]
    }));

    this.initializeSearch(index);
  }

  initializeSearch(index: number) {
    this.searchTerms[index] = new Subject<string>();
    this.filteredProducts[index] = [];
    this.showDropdown[index] = false;
    this.pagination[index] = { page: 1, hasMore: true, loading: false, total: 0 };

    this.searchTerms[index].pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.pagination[index] = { page: 1, hasMore: true, loading: true, total: 0 };
        this.filteredProducts[index] = [];

        // Отправляем запрос даже при пустом термине
        return this.incidentService.searchProducts(term || '', 1, this.PAGE_SIZE);
      })
    ).subscribe({
      next: (res: any) => {
        this.handleSearchResponse(index, res, true);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.pagination[index].loading = false;
        this.filteredProducts[index] = [];
        this.showDropdown[index] = true;
      }
    });
  }

  private handleSearchResponse(index: number, res: any, isNewSearch: boolean = false) {
    const searchTerm = this.items.at(index).get('product_search')?.value;
    const existingProducts = res.items || [];

    if (isNewSearch) {
      this.filteredProducts[index] = [];
    }

    let productsToAdd = existingProducts;

    // Добавляем опцию создания нового товара если есть поисковый запрос
    if (isNewSearch && searchTerm && searchTerm.length > 0) {
      const exactMatch = existingProducts.find((p: any) =>
        p.name.toLowerCase() === searchTerm.toLowerCase()
      );

      // Показываем опцию создания даже если нет результатов
      if (!exactMatch) {
        productsToAdd = [
          ...existingProducts,
          {
            id: null,
            name: `Создать новый товар: "${searchTerm}"`,
            is_new: true,
            new_name: searchTerm
          }
        ];
      }
    }

    this.filteredProducts[index] = [...this.filteredProducts[index], ...productsToAdd];
    this.pagination[index] = {
      page: res.page || 1,
      hasMore: (res.page || 1) * this.PAGE_SIZE < (res.total || 0),
      loading: false,
      total: res.total || 0
    };

    this.showDropdown[index] = true;
  }


  onQuantityInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Убираем ведущие нули
    if (value.startsWith('0') && value.length > 1 && !value.startsWith('0.')) {
      const cleanValue = value.replace(/^0+/, '');
      this.items.at(index).get('quantity')?.setValue(cleanValue, { emitEvent: true });
    }
  }

  onAmountInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Убираем ведущие нули для целой части
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      if (integerPart.startsWith('0') && integerPart.length > 1) {
        const cleanInteger = integerPart.replace(/^0+/, '');
        const cleanValue = cleanInteger + '.' + decimalPart;
        this.items.at(index).get('amount')?.setValue(cleanValue, { emitEvent: true });
      }
    } else {
      if (value.startsWith('0') && value.length > 1) {
        const cleanValue = value.replace(/^0+/, '');
        this.items.at(index).get('amount')?.setValue(cleanValue, { emitEvent: true });
      }
    }
  }

  onProductSearch(index: number, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchTerms[index].next(searchTerm);
  }

  onProductFocus(index: number) {
    const currentValue = this.items.at(index).get('product_search')?.value;

    // При фокусе отправляем текущее значение или пустую строку
    if (currentValue) {
      this.searchTerms[index].next(currentValue);
    } else {
      // Отправляем пустой запрос для получения всех товаров
      this.searchTerms[index].next('');
    }
  }



  // Обработчик прокрутки для бесконечной подгрузки
  onDropdownScroll(index: number, event: Event) {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom && this.pagination[index]?.hasMore && !this.pagination[index]?.loading) {
      this.loadMoreProducts(index);
    }
  }

  private loadMoreProducts(index: number) {
    const searchTerm = this.items.at(index).get('product_search')?.value || '';
    const nextPage = this.pagination[index].page + 1;

    this.pagination[index].loading = true;

    this.incidentService.searchProducts(searchTerm, nextPage, this.PAGE_SIZE)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.handleSearchResponse(index, res, false);
        },
        error: (error) => {
          console.error('Load more error:', error);
          this.pagination[index].loading = false;
        }
      });
  }

  selectProduct(index: number, product: any) {
    const itemGroup = this.items.at(index) as FormGroup;

    if (product.is_new) {
      itemGroup.patchValue({
        product_id: null,
        product_search: product.new_name,
        is_new_product: true
      });
      this.selectedProducts[index] = {
        name: product.new_name,
        is_new: true
      };
    } else {
      itemGroup.patchValue({
        product_id: product.id,
        product_search: product.name,
        is_new_product: false
      });
      this.selectedProducts[index] = product;
    }

    this.showDropdown[index] = false;
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.rebuildIndexes();
  }

  private rebuildIndexes() {
    const newFilteredProducts: { [key: number]: any[] } = {};
    const newShowDropdown: { [key: number]: boolean } = {};
    const newSearchTerms: { [key: number]: Subject<string> } = {};
    const newSelectedProducts: { [key: number]: any } = {};
    const newPagination: { [key: number]: any } = {};

    for (let i = 0; i < this.items.length; i++) {
      newFilteredProducts[i] = this.filteredProducts[i] || [];
      newShowDropdown[i] = this.showDropdown[i] || false;
      newSearchTerms[i] = this.searchTerms[i] || new Subject<string>();
      newSelectedProducts[i] = this.selectedProducts[i] || null;
      newPagination[i] = this.pagination[i] || { page: 1, hasMore: true, loading: false, total: 0 };
    }

    this.filteredProducts = newFilteredProducts;
    this.showDropdown = newShowDropdown;
    this.searchTerms = newSearchTerms;
    this.selectedProducts = newSelectedProducts;
    this.pagination = newPagination;
  }

  async onSubmit() {
    if (this.incidentForm.valid) {
      const formValue = this.incidentForm.value;

      try {
        const itemsWithCreatedProducts = await this.createNewProducts(formValue.items);

        const payload = {
          ...formValue,
          managerUsername: this.managerUsername,
          items: itemsWithCreatedProducts.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            amount: item.amount
          }))
        };

        this.submitted.emit(payload);
      } catch (error) {
        console.error('Ошибка при создании товаров:', error);
      }
    } else {
      this.markFormGroupTouched(this.incidentForm);
    }
  }

  private async createNewProducts(items: any[]): Promise<any[]> {
    const results = [];

    for (const item of items) {
      if (item.is_new_product && !item.product_id) {
        try {
          const newProduct = await this.incidentService.createProduct({
            name: item.product_search,
            sku: ''
          }).toPromise();

          results.push({
            ...item,
            product_id: newProduct.id
          });
        } catch (error) {
          console.error('Ошибка создания товара:', error);
          continue;
        }
      } else {
        results.push(item);
      }
    }

    return results;
  }

  onCancelEdit() {
    this.cancelled.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  patchForm(incident: any) {
    this.incidentForm.patchValue({
      date: incident.date?.split('T')[0],
      contractor: incident.contractor,
      details: incident.details,
      reason_type_id: incident.reason_type?.id
    });

    this.items.clear();
    if (incident.items && incident.items.length) {
      incident.items.forEach((item: any, index: number) => {
        this.items.push(this.fb.group({
          product_id: [item.product.id, Validators.required],
          product_search: [item.product.name],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          amount: [item.amount, [Validators.required, Validators.min(0)]],
          is_new_product: [false]
        }));

        this.initializeSearch(index);
        this.selectedProducts[index] = item.product;
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Закрываем все dropdown если клик не по search-wrapper И не по dropdown
    if (!target.closest('.search-wrapper') && !target.closest('.dropdown')) {
      Object.keys(this.showDropdown).forEach(key => {
        this.showDropdown[+key] = false;
      });
    }
  }
}