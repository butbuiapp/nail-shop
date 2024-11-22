import { Component, inject, OnInit } from '@angular/core';
import { AppointmentResponse } from '../../model/appointment.model';
import { AppointmentService } from '../../service/appointment.service';
import { CommonModule } from '@angular/common';
import { AppointmentComponent } from './appointment/appointment.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppointmentStatusEnum } from '../../model/appointment.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, AppointmentComponent, ReactiveFormsModule],
  templateUrl: './appointments-management.component.html',
  styleUrl: './appointments-management.component.css'
})
export class AppointmentsManagementComponent implements OnInit {
  appointments: AppointmentResponse[] = [];
  errorMessage: string | null = null;
  appointmentDate = new FormControl(new Date());

  private appointmentService = inject(AppointmentService);
  AppointmentStatusEnum = AppointmentStatusEnum;

  ngOnInit(): void {  
    this.searchAppointmentsByDate(new Date());
  }

  searchAppointmentsByDate(appointmentDate: Date) {
    this.appointmentService.searchAppointmentsByDate({appointmentDate}).subscribe(
      (response) => {
        this.appointments = response;
      },
      () => {
        this.errorMessage = "Failed to load appointments.";
      }
    );
  }

  onSearch(): void {
    const date = this.appointmentDate.value;
    if (date) {
      this.searchAppointmentsByDate(date);
    }
  }

  trackByAppointmentId(index: number, appointment: AppointmentResponse): number {
    return appointment.id;
  }

  onCancelCompleted() {
    const date = this.appointmentDate.value;
    if (date) {
      this.searchAppointmentsByDate(date);
    } else {
      this.searchAppointmentsByDate(new Date());
    }    
  }

  isBooked(status : AppointmentStatusEnum) {
    return status === AppointmentStatusEnum.BOOKED;
  }
}
