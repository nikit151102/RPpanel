import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MicrofrontendApiService } from '../../api/microfrontend-api.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
  id: string;
  name: string;
  route: string;
  order: number;
  is_active: boolean;
  has_access: boolean;
  children: any;
}

@Component({
  selector: 'app-vertical-menu-tabs',
  imports: [CommonModule],
  templateUrl: './vertical-menu-tabs.component.html',
  styleUrl: './vertical-menu-tabs.component.scss'
})
export class VerticalMenuTabsComponent implements OnInit {

  @Input() currentRoute: string = '';
  @ViewChild('mobileNavScroll') mobileNavScroll!: ElementRef;
  
  itemsMenu: MenuItem[] = [];
  currentTab = '';

  isSidebarCollapsed = false;
  isMobile = false;
  isMobileMenuCollapsed = true;
  
  // Для индикаторов скролла
  showScrollLeft = false;
  showScrollRight = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private microfrontendApiService: MicrofrontendApiService
  ) { }

  ngOnInit(): void {
    this.microfrontendApiService.getMicrofrontendToRouter(this.currentRoute).subscribe((data: any) => {
      this.itemsMenu = data.tabs;
      // После загрузки меню проверяем скролл
      setTimeout(() => this.checkScroll(), 100);
    })
    
    this.updateCurrentRoute();
    this.checkScreenSize();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentRoute();
      this.closeMobileMenu();
    });

    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      this.isSidebarCollapsed = JSON.parse(savedState);
    }
  }

  ngAfterViewInit() {
    this.checkScroll();
  }

  private updateCurrentRoute() {
    const urlSegments = this.router.url.split('/');
    this.currentTab = urlSegments[urlSegments.length - 1] || 'dashboard';
  }

  navigate(segment: string) {
    this.router.navigate([segment], { relativeTo: this.route });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
    this.checkScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;

    if (this.isMobile) {
      this.isSidebarCollapsed = true;
      this.isMobileMenuCollapsed = true;
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.isSidebarCollapsed));
  }

  // Методы для мобильного меню
  toggleMobileMenu() {
    this.isMobileMenuCollapsed = !this.isMobileMenuCollapsed;

  }

  closeMobileMenu() {
    this.isMobileMenuCollapsed = true;
  }

  // Проверка скролла для показа индикаторов
  checkScroll() {
    if (!this.mobileNavScroll?.nativeElement || this.isMobileMenuCollapsed) return;

    const element = this.mobileNavScroll.nativeElement;
    this.showScrollLeft = element.scrollLeft > 10;
    this.showScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth - 10);
  }

  // Скролл меню
  scrollMobileMenu(direction: 'left' | 'right') {
    if (!this.mobileNavScroll?.nativeElement) return;

    const element = this.mobileNavScroll.nativeElement;
    const scrollAmount = 200;
    
    if (direction === 'left') {
      element.scrollLeft -= scrollAmount;
    } else {
      element.scrollLeft += scrollAmount;
    }
    
    setTimeout(() => this.checkScroll(), 150);
  }

  // Обработчик скролла для мобильного меню
  onMobileMenuScroll(event: any) {
    this.checkScroll();
  }
}