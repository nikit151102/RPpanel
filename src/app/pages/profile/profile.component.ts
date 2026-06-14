import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../../services/current-user.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

    constructor(private currentUserService: CurrentUserService) {}
  
    ngOnInit(): void {
      this.currentUserService.getDataUser().subscribe((value: any) => {
        this.currentUserService.setData(value);
      });
    }
}
