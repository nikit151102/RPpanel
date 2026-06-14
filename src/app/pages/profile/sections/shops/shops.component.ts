import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerticalMenuTabsComponent } from '../../../../components/vertical-menu-tabs/vertical-menu-tabs.component';

interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VerticalMenuTabsComponent],
  templateUrl: './shops.component.html',
  styleUrl: './shops.component.scss'
})
export class ShopsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}