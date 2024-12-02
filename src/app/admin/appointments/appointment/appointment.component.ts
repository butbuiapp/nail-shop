import { Component, EventEmitter, inject, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentResponse } from '../../../model/appointment.model';
import { DatePipe } from '@angular/common';
import { AppointmentStatusEnum } from '../../../model/appointment.model';
import { AppointmentService } from '../../../service/appointment.service';
import { UpdateAppointmentComponent } from "../update-appointment/update-appointment.component";
import { PrintReceiptComponent } from '../../print-receipt/print-receipt.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, DatePipe, UpdateAppointmentComponent, PrintReceiptComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit, OnChanges {
  // input
  appointment = input.required<AppointmentResponse>();
  @Input() isReadOnly: boolean = false;
  
  errorMessage : string | null = null;
  isUpdating: boolean = false;
  isPrintingReceipt: boolean = false;
  editingAppointment: AppointmentResponse = {
      id: 0,
      date: '',
      time: '',
      customer: {
        id: 0,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        dob: new Date,
        password: '',    
        earnedPoint: 0 
      },
      technician: {
        id: 0,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        dob: '',
        password: '',
        role: ''
      },
      notes: '',
      invoice: null,
      status: AppointmentStatusEnum.BOOKED
  };

  // inject
  AppointmentStatusEnum = AppointmentStatusEnum;  
  private appointmentService = inject(AppointmentService);

  showInvoiceMap: { [appointmentId: number]: boolean } = {};

  toggleInvoice(appointmentId: number) {
    this.showInvoiceMap[appointmentId] = !this.showInvoiceMap[appointmentId];
  }

  ngOnInit(): void {
      this.editingAppointment = this.appointment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.editingAppointment = this.appointment();
  }

  // callback event to parent (appointments)
  // output
  @Output() cancel = new EventEmitter<number>();

  cancelAppointment() {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(this.appointment().id).subscribe(
        () => {
          this.cancel.emit();          
        },
        (error) => {
          this.errorMessage = 'Failed to cancel appointment. Please try again later.';
        }
      );
    }
  }

  updateAppointment() {
    this.editingAppointment = this.appointment();
    this.isUpdating = true;
  }

  onCancel() {
    this.isUpdating = false;
    this.isPrintingReceipt = false;
  }

  onUpdateCompleted() {
    this.appointmentService.getAppointmentById(this.appointment().id).subscribe(
      (response: AppointmentResponse) => {
        this.editingAppointment = response;
        this.isUpdating = false;
      },
      (error) => {
        this.errorMessage = 'Failed to update appointment. Please try again later.';
      }
    );
  }

  completeAppointment() {
    if (confirm('Are you sure you want to complete this appointment?')) {
      this.appointmentService.completeAppointment(this.appointment().id).subscribe(
        () => {
          this.cancel.emit();          
        },
        (error) => {
          this.errorMessage = 'Failed to complete appointment. Please try again later.';
        }
      );
    }
  }

  printReceipt() {
    this.editingAppointment = this.appointment();
    this.isPrintingReceipt = true;
  }

  onPrintCompleted() {
    this.isPrintingReceipt = false;
  }
}
