import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-card',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './admin-card.component.html',
  styleUrl: './admin-card.component.css'
})
export class AdminCardComponent {

}
