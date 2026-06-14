import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { VerticalMenuTabsComponent } from '../../../../components/vertical-menu-tabs/vertical-menu-tabs.component';

@Component({
  selector: 'app-sales-managers',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VerticalMenuTabsComponent],
  templateUrl: './sales-managers.component.html',
  styleUrl: './sales-managers.component.scss'
})
export class SalesManagersComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobile = false;


  constructor() { }

  ngOnInit() {

    this.checkScreenSize();

    // Восстанавливаем состояние меню из localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      this.isSidebarCollapsed = JSON.parse(savedState);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;

    // На мобильных устройствах меню по умолчанию скрыто
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
    }
  }



  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;

    // Сохраняем состояние в localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.isSidebarCollapsed));
  }


  getUserInitials(): string {
    return 'АС'; // Администратор Система
  }
}