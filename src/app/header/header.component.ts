import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CurrentUserService } from '../../services/current-user.service';
import { PermissionsService } from '../../services/permissions.service';
import { AuthService } from '../pages/auth/auth.service';

interface Microfrontend {
  id: string;
  name: string;
  route: string;
  url: string;
  is_active: boolean;
  priority: number;
  tabs: Tab[];
  roles: any[];
  permissions: any[];
  isDropdownOpen?: boolean
}

interface Tab {
  id: string;
  name: string;
  route: string;
  order: number;
  is_active: boolean;
  has_access: boolean;
  children: Tab[];
}

interface User {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, MenubarModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  microfrontends: Microfrontend[] = [];
  user: User | null = null;
  userRole: string = '';

  showProfileMenu: boolean = false;
  showMobileMenu: boolean = false;
  mobileOpenStates: { [key: string]: boolean } = {};
  mobileTabOpenStates: { [key: string]: boolean } = {};
  
  private clickProcessed: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private permissionsService: PermissionsService,
    private currentUserService: CurrentUserService
  ) { }

  ngOnInit() {
    this.loadMicrofrontends();
    this.loadUserData();
    this.setupRouteListener();
  }

  loadMicrofrontends(): void {
    this.permissionsService.getAllMicrofrontends().subscribe({
      next: (data: any) => {
        console.log('Microfrontends loaded:', data);
        this.microfrontends = this.processMicrofrontends(data.microfrontends);
      },
      error: (error) => {
        console.error('Error loading microfrontends:', error);
      }
    });
  }

  processMicrofrontends(data: any[]): Microfrontend[] {
    return data
      .filter(mf => mf.is_active)
      .sort((a, b) => a.priority - b.priority)
      .map(mf => ({
        ...mf,
        isDropdownOpen: false,
        tabs: this.processTabs(mf.tabs || [])
      }));
  }

  processTabs(tabs: any[]): Tab[] {
    return tabs
      .filter(tab => tab.is_active)
      .sort((a, b) => a.order - b.order)
      .map(tab => ({
        ...tab,
        children: this.processTabs(tab.children || [])
      }));
  }

  hasAccessToMicrofrontend(microfrontend: Microfrontend): boolean {
    // Проверяем доступ к микрофронтенду
    // Можно добавить дополнительную логику проверки прав
    return microfrontend.tabs?.some(tab => tab.has_access) || false;
  }

loadUserData(): void {
  this.currentUserService.getDataUser().subscribe((data: any) => {
    const firstRole = data.roles && data.roles.length > 0 ? data.roles[0].name : 'Без роли';

    this.user = {
      name: `${data.last_name} ${data.first_name}`,
      email: data.email,
      role: firstRole
    };

    this.userRole = firstRole;
  });
}

  getUserName(): string {
    return this.user?.name || 'Пользователь';
  }

  setupRouteListener(): void {
    this.router.events.subscribe(() => {
      // Можно добавить логику обновления активного состояния
    });
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  toggleMicrofrontendDropdown(microfrontend: Microfrontend, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Закрываем все другие выпадающие меню
    this.microfrontends.forEach(mf => {
      if (mf.id !== microfrontend.id) {
        mf.isDropdownOpen = false;
      }
    });

    // Переключаем текущее меню
    microfrontend.isDropdownOpen = !microfrontend.isDropdownOpen;
    this.clickProcessed = true;

    setTimeout(() => {
      this.clickProcessed = false;
    });
  }

  toggleProfileMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.showProfileMenu = !this.showProfileMenu;
    this.clickProcessed = true;

    // Закрываем все выпадающие меню микрофронтов
    this.microfrontends.forEach(mf => {
      mf.isDropdownOpen = false;
    });

    setTimeout(() => {
      this.clickProcessed = false;
    });
  }

  closeAllDropdowns(): void {
    this.microfrontends.forEach(mf => {
      mf.isDropdownOpen = false;
    });
    this.showProfileMenu = false;
  }

  logout(): void {
    // Логика выхода
    console.log('Logout');
    this.router.navigate(['/login']);
    this.closeAllDropdowns();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.clickProcessed) {
      return;
    }

    const target = event.target as HTMLElement;

    // Закрываем меню профиля при клике вне его
    if (!target.closest('.profile-wrapper')) {
      this.showProfileMenu = false;
    }

    // Закрываем выпадающие меню микрофронтов при клике вне их
    if (!target.closest('.menu-item.has-dropdown')) {
      this.microfrontends.forEach(mf => {
        mf.isDropdownOpen = false;
      });
    }
  }



  getUserInitials(): string {
    const name = this.user?.name || 'Пользователь';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleNotifications(): void {
    // Логика переключения уведомлений
    console.log('Toggle notifications');
  }

  // Добавьте свойство для уведомлений
  unreadNotifications: number = 3;


  navigateToTab(microfrontendRoute: string, tab: any) {
    if (!tab.has_access) return;

    this.closeAllDropdowns();

    this.router.navigate([microfrontendRoute, tab.route], { relativeTo: this.route });
  }

    toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    if (!this.showMobileMenu) {
      this.mobileOpenStates = {};
      this.mobileTabOpenStates = {};
    }
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
    this.mobileOpenStates = {};
    this.mobileTabOpenStates = {};
  }

  toggleMobileSubmenu(microfrontendId: string): void {
    this.mobileOpenStates[microfrontendId] = !this.mobileOpenStates[microfrontendId];
    
    // Закрываем другие открытые меню
    Object.keys(this.mobileOpenStates).forEach(key => {
      if (key !== microfrontendId) {
        this.mobileOpenStates[key] = false;
      }
    });
  }

  toggleMobileTab(tabId: string, microfrontendRoute: string, tab: any): void {
    if (tab.children.length > 0) {
      // Если есть дочерние элементы, переключаем их отображение
      this.mobileTabOpenStates[tabId] = !this.mobileTabOpenStates[tabId];
    } else {
      // Если нет дочерних элементов, переходим по ссылке
      this.navigateToTab(microfrontendRoute, tab);
      this.closeMobileMenu();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // Закрываем мобильное меню при изменении размера на десктоп
    if (window.innerWidth >= 1025) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeMobileMenu();
    this.closeAllDropdowns();
  }
}