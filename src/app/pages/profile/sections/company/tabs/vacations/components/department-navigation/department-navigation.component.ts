import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-navigation.component.html',
  styleUrls: ['./department-navigation.component.scss']
})
export class DepartmentNavigationComponent {
  @Input() departments: any[] = [];
  @Input() activeDepartment = '';
  @Output() setActiveDepartment = new EventEmitter<string>();
}