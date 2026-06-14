import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-super-admin',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.scss'
})
export class SuperAdminComponent implements OnInit {
  currentRoute = '';
  
  itemsMenu: MenuItem[] = [
    { label: 'Водители', route: 'drivers' },
    { label: 'Маршруты', route: 'routes' },
    { label: 'Справочники', route: 'directories' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}


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