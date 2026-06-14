// drivers.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VerticalMenuTabsComponent } from '../../../../components/vertical-menu-tabs/vertical-menu-tabs.component';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VerticalMenuTabsComponent],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriverComponent implements OnInit {
  currentRoute = '';

  itemsMenu: MenuItem[] = [
    { label: 'Маршруты', route: 'routes' },
    { label: 'Справочники', route: 'directories' },
    { label: 'Отчет по городской логистике', route: 'cityDriversReport' },
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