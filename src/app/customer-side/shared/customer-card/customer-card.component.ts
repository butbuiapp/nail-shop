import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerHeaderComponent } from "../../customer-header/customer-header.component";

@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [RouterOutlet, CustomerHeaderComponent],
  templateUrl: './customer-card.component.html',
  styleUrl: './customer-card.component.css'
})
export class CustomerCardComponent {

}
