import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentResponse } from '../../../model/appointment.model';
import { DatePipe } from '@angular/common';
import { AppointmentStatusEnum } from '../../../model/appointment.model';
import { AppointmentService } from '../../../service/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css'
})
export class AppointmentDetailComponent {
  // input
  appointment = input.required<AppointmentResponse>();

  // output
  @Output() cancel = new EventEmitter<number>();

  // inject
  AppointmentStatusEnum = AppointmentStatusEnum;  
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  showInvoiceMap: { [appointmentId: number]: boolean } = {};

  toggleInvoice(appointmentId: number) {
    this.showInvoiceMap[appointmentId] = !this.showInvoiceMap[appointmentId];
  }

  cancelAppointment() {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(this.appointment().id).subscribe(
        () => {
          this.cancel.emit(this.appointment().id);          
        },
        (error) => {
          //this.errorMessage = 'Failed to delete appointment. Please try again later.';
        }
      );
    }
  }

  updateAppointment() {
    this.router.navigate(['/customer/new-appointment'], {
      state: {appointment: this.appointment()}
    });
  }
}
