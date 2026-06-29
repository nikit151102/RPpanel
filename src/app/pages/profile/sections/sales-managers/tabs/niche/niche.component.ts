import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductNiche, ProductCategory, Product, ProductNicheDto } from '../../../../../../models/niche.model';
import { NicheService } from '../../../../../../services/niche.service';
import { ProductService } from '../../../../../../services/product.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FilterByNamePipe } from "../../../../../../pipes/filter-by-name.pipe";
import { AuthService } from '../../../../../../services/auth.service';


type ModalMode = 'login' | 'create' | 'edit' | 'categories' | 'products' | null;

@Component({
  selector: 'app-niche',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, FilterByNamePipe],
  templateUrl: './niche.component.html',
  styleUrl: './niche.component.scss'
})
export class NicheComponent implements OnInit {
  // Auth
  loginForm: FormGroup;
  isAuthenticated = false;
  authError = '';

  // Data
  niches: ProductNiche[] = [];
  categories: ProductCategory[] = [];
  products: Product[] = [];
  allCategories: ProductCategory[] = [];
  allProducts: Product[] = [];

  // UI state
  modalMode: ModalMode = null;
  selectedNiche: ProductNiche | null = null;
  nicheForm: FormGroup;
  searchQuery = '';
  categorySearch = '';
  productSearch = '';
  selectedCategoryIds: Set<string> = new Set();
  selectedProductIds: Set<string> = new Set();
  isLoading = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalCount = 0;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private nicheService: NicheService,
    private productService: ProductService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.nicheForm = this.fb.group({
      id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      viewType: [1]
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();

    if (this.isAuthenticated) {
      this.loadNiches();
    } else {
      this.isLoading = true;
      this.auth.loginWithDefaultCredentials().subscribe({
        next: (response) => {
          this.isAuthenticated = true;
          this.isLoading = false;
          this.loadNiches();
          this.showToast('Автоматический вход выполнен', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          this.showToast('Ошибка автоматической авторизации', 'error');
          console.error('Auth error:', err);
        }
      });
    }
  }

  // ==================== AUTH ====================
  login(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.authError = '';

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isAuthenticated = true;
        this.modalMode = null;
        this.isLoading = false;
        this.loadNiches();
        this.showToast('Успешный вход!', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        this.authError = 'Ошибка авторизации. Проверьте логин и пароль.';
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.isAuthenticated = false;
    this.niches = [];
  }

  // ==================== NICHES ====================
  loadNiches(): void {
    this.isLoading = true;
    const query = {
      filters: this.searchQuery
        ? [{ field: 'name', values: [this.searchQuery], type: 0 },
        { field: 'viewType', values: [1], type: 0 }
        ]
        : [],
      sorts: [],
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.nicheService.filterNiches(query).subscribe({
      next: (res) => {
        this.niches = res.data || [];
        this.totalCount = res.totalCount || 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Ошибка загрузки ниш', 'error');
      }
    });
  }

  openCreateModal(): void {
    this.nicheForm.reset({ viewType: 0 });
    this.modalMode = 'create';
  }

  viewNiche(niche: ProductNiche): void {
    const url = `https://пакетон.рф/niche/${niche.id}?viewMode=flipbook`;
    window.open(url, '_blank');
  }

  openEditModal(niche: ProductNiche): void {
    this.nicheForm.patchValue({
      id: niche.id,
      code: niche.code,
      name: niche.name,
      description: niche.description,
      viewType: niche.viewType
    });
    this.modalMode = 'edit';
  }



  saveNiche(): void {
    if (this.nicheForm.invalid) return;
    this.isLoading = true;
    const dto: ProductNicheDto = this.nicheForm.value;

    const request = this.modalMode === 'create'
      ? this.nicheService.createNiche(dto)
      : this.nicheService.updateNiche(dto.id!, dto);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.modalMode = null;
        this.loadNiches();
        this.showToast(
          this.modalMode === 'create' ? 'Ниша создана' : 'Ниша обновлена',
          'success'
        );
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Ошибка сохранения', 'error');
      }
    });
  }

  deleteNiche(niche: ProductNiche): void {
    if (!confirm(`Удалить нишу "${niche.name}"?`)) return;
    this.isLoading = true;
    this.nicheService.deleteNiche(niche.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadNiches();
        this.showToast('Ниша удалена', 'success');
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Ошибка удаления', 'error');
      }
    });
  }

  // ==================== CATEGORIES ====================
  openCategoriesModal(niche: ProductNiche): void {
    this.selectedNiche = niche;
    this.selectedCategoryIds = new Set(
      (niche.subCategories || []).map(c => c.id)
    );
    this.loadAllCategories();
    this.modalMode = 'categories';
  }

  loadAllCategories(): void {
    this.productService.filterCategories({
      filters: [],
      sorts: [],
      page: 0,
      pageSize: 1000
    }).subscribe({
      next: (res) => this.allCategories = res.data || [],
      error: () => this.showToast('Ошибка загрузки категорий', 'error')
    });
  }

  toggleCategory(id: string): void {
    if (this.selectedCategoryIds.has(id)) {
      this.selectedCategoryIds.delete(id);
    } else {
      this.selectedCategoryIds.add(id);
    }
  }

  saveCategories(): void {
    if (!this.selectedNiche) return;
    this.isLoading = true;
    const currentIds = new Set((this.selectedNiche.subCategories || []).map(c => c.id));
    const newIds = Array.from(this.selectedCategoryIds);

    const toAdd = newIds.filter(id => !currentIds.has(id));
    const toRemove = Array.from(currentIds).filter(id => !this.selectedCategoryIds.has(id));

    const requests: any[] = [];
    if (toAdd.length) requests.push(this.nicheService.addCategoriesToNiche(this.selectedNiche.id, toAdd));
    if (toRemove.length) requests.push(this.nicheService.removeCategoriesFromNiche(this.selectedNiche.id, toRemove));

    if (!requests.length) {
      this.modalMode = null;
      this.isLoading = false;
      return;
    }

    let done = 0;
    requests.forEach(req => req.subscribe({
      next: () => {
        done++;
        if (done === requests.length) {
          this.isLoading = false;
          this.modalMode = null;
          this.loadNiches();
          this.showToast('Категории обновлены', 'success');
        }
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Ошибка сохранения категорий', 'error');
      }
    }));
  }

  // ==================== PRODUCTS ====================
  openProductsModal(niche: ProductNiche): void {
    this.selectedNiche = niche;
    this.selectedProductIds = new Set((niche.products || []).map(p => p.id));
    this.searchProductsForModal();
    this.modalMode = 'products';
  }

  searchProductsForModal(): void {
    const query = {
      filters: this.productSearch
        ? [{ field: 'searchQuery', values: [this.productSearch], type: 0 }]
        : [],
      sorts: [],
      page: 0,
      pageSize: 100
    };
    this.productService.searchProducts(query).subscribe({
      next: (res) => this.allProducts = res.data || [],
      error: () => this.showToast('Ошибка поиска товаров', 'error')
    });
  }

  toggleProduct(id: string): void {
    if (this.selectedProductIds.has(id)) {
      this.selectedProductIds.delete(id);
    } else {
      this.selectedProductIds.add(id);
    }
  }

  saveProducts(): void {
    if (!this.selectedNiche) return;
    this.isLoading = true;
    const currentIds = new Set((this.selectedNiche.products || []).map(p => p.id));
    const newIds = Array.from(this.selectedProductIds);

    const toAdd = newIds.filter(id => !currentIds.has(id));
    const toRemove = Array.from(currentIds).filter(id => !this.selectedProductIds.has(id));

    const requests: any[] = [];
    if (toAdd.length) requests.push(this.nicheService.addProductsToNiche(this.selectedNiche.id, toAdd));
    if (toRemove.length) requests.push(this.nicheService.removeProductsFromNiche(this.selectedNiche.id, toRemove));

    if (!requests.length) {
      this.modalMode = null;
      this.isLoading = false;
      return;
    }

    let done = 0;
    requests.forEach(req => req.subscribe({
      next: () => {
        done++;
        if (done === requests.length) {
          this.isLoading = false;
          this.modalMode = null;
          this.loadNiches();
          this.showToast('Товары обновлены', 'success');
        }
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Ошибка сохранения товаров', 'error');
      }
    }));
  }

  // ==================== UI HELPERS ====================
  closeModal(): void {
    if (!this.isLoading) this.modalMode = null;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadNiches();
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadNiches();
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.loadNiches();
    }
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}