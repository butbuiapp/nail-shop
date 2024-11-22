import { Component, inject, OnInit } from '@angular/core';
import { AppointmentResponse } from '../../model/appointment.model';
import { AppointmentService } from '../../service/appointment.service';
import { CommonModule } from '@angular/common';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { AuthService } from '../../service/auth.service';
import { AppointmentStatusEnum } from '../../model/appointment.model';

@Component({
  selector: 'app-customer-appointment',
  standalone: true,
  imports: [CommonModule, AppointmentDetailComponent],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit {

  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  phoneNumber : string = "";
  appointments: AppointmentResponse[] = [];
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.getAppointmentsByCustomerPhone();
  }

  getAppointmentsByCustomerPhone() {
    this.phoneNumber = this.authService.getLoggedInUsername();

    this.appointmentService.getAppointmentsByCustomerPhone(this.phoneNumber).subscribe(
      (response) => {
        this.appointments = response;
      },
      (error) => {
        if (error.error) {
          this.errorMessage = error.error;
        }          
      }
    );
  }

  trackByAppointmentId(index: number, appointment: AppointmentResponse): number {
    return appointment.id;
  }

  onCancelCompleted(appointmentId: number) {
    this.getAppointmentsByCustomerPhone();
  }

  isBooked(status : AppointmentStatusEnum) {
    return status === AppointmentStatusEnum.BOOKED;
  }
}
