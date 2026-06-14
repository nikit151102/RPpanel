import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { VerticalMenuTabsComponent } from '../../../../components/vertical-menu-tabs/vertical-menu-tabs.component';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VerticalMenuTabsComponent],
  templateUrl: './hr.component.html',
  styleUrl: './hr.component.scss'
})
export class HrComponent implements OnInit {
  currentRoute = '';

  itemsMenu: MenuItem[] = [
    { label: 'Телеграмм бот', route: 'telegramBot' },
    { label: 'Вакансии работа.пакетон.рф', route: 'vacancies' },
    { label: 'Резюме работа.пакетон.рф', route: 'resumes' },
    { label: 'Обратная связь работа.пакетон.рф', route: 'feedback' }
  ];


  constructor(private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.updateCurrentRoute();

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
    return 'АС';
  }
}