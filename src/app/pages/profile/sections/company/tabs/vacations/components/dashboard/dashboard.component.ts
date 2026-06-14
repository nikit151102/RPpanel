import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vacation } from '../../vacation.interface.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() vacations: Vacation[] = [];
  @Input() approvedVacationsCount = 0;
  @Input() pendingVacationsCount = 0;
  @Input() activeVacationsCount = 0;
  @Input() rejectedVacationsCount = 0;
  @Input() cancelledVacationsCount = 0;

  get totalVacationsCount(): number {
    return this.vacations.length;
  }
}