import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { VerticalMenuTabsComponent } from '../../../../components/vertical-menu-tabs/vertical-menu-tabs.component';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-company',
  imports: [CommonModule, RouterOutlet, VerticalMenuTabsComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  currentRoute = '';

  itemsMenu: MenuItem[] = [
    { label: 'Сотрудники', route: 'users' },
    { label: 'Права доступа ', route: 'access' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.updateCurrentRoute();

    // Следим за изменениями маршрута
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentRoute();
    });
  }

  private updateCurrentRoute() {
    const urlSegments = this.router.url.split('/');
    this.currentRoute = urlSegments[urlSegments.length - 1] || 'drivers';
  }

  navigate(segment: string) {
    this.router.navigate([segment], { relativeTo: this.route });
  }
  getUserInitials(): string {
    return 'АС'; // Администратор Система
  }
}