import { Component, EventEmitter, input, Output } from '@angular/core';
import { AppointmentResponse } from '../../model/appointment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-print-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-receipt.component.html',
  styleUrl: './print-receipt.component.css'
})
export class PrintReceiptComponent {
  appointment = input.required<AppointmentResponse>();

  @Output() close = new EventEmitter<void>();

  issuedDateTime = new Date();

  onCancel(): void {
    this.close.emit();
  }

  printReceipt(): void {
    window.print();
    this.onCancel();
  }
}
