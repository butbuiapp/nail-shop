import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NailServiceService } from '../../../service/nail-service.service';
import { EmployeeService } from '../../../service/employee.service';
import { NailService } from '../../../model/nail-service.model';
import { Employee } from '../../../model/employee.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentResponse, AppointmentForm, AppointmentRequest } from '../../../model/appointment.model';
import { AppointmentService } from '../../../service/appointment.service';
import { getErrorMessage } from '../../../common/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-appointment.component.html',
  styleUrl: './update-appointment.component.css'
})
export class UpdateAppointmentComponent implements OnInit {

  services: NailService[] = [];
  employees: Employee[] = [];
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  totalAmount: number = 0;
  appointmentId?: number = 0;
  appointmentForm!: FormGroup;
  today: Date = new Date;

  // for edit appointment
  @Input() appointment : AppointmentResponse | null = null;
  editingAppointment: AppointmentForm | null = null;

  @Output() cancel = new EventEmitter();
  @Output() updated = new EventEmitter();

  // inject
  private employeeService = inject(EmployeeService);
  private nailServiceService = inject(NailServiceService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      employee: ['', Validators.required],
      selectedServices: this.fb.array([]),
      notes: [''],
    });
  }

  ngOnInit(): void {
    if (this.appointment) {
      this.editingAppointment = this.convertAppointmentResponseToForm(this.appointment);
      this.appointmentForm.patchValue(this.editingAppointment);
    }

    this.appointmentId = this.editingAppointment?.id;
    this.loadNailServices();
    this.loadEmployees();

    // Add preselected services to the form array
    if (this.editingAppointment?.selectedServices) {
      const selectedServicesArray = this.appointmentForm.get('selectedServices') as FormArray;
      this.editingAppointment.selectedServices.forEach((service) => {
        selectedServicesArray.push(this.fb.control(service));
      });
      this.calculateTotal(); // Calculate total based on preselected services
    }
  }

  loadNailServices() {
    this.nailServiceService.getNailServices().subscribe(
      (response) => {
        this.services = response;
      },
      (error) => {
        this.errorMessage = 'Failed to load services.'
      }
    );
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(
      (response) => {
        this.employees = response;
      },
      (error) => {
        this.errorMessage = 'Failed to load employees.'
      }
    );
  }

  // Total calculation
  calculateTotal() {
    this.totalAmount = this.appointmentForm.value.selectedServices
      .map((service: NailService) => service.price)
      .reduce((a: number, b: number) => a + b, 0);
  }

  // To handle service selection and calculate total
  onServiceChange(event: any, service: any) {
    const selectedServices = this.appointmentForm.get('selectedServices') as FormArray;
    if (event.target.checked) {
      // Add service to the form array
      selectedServices.push(this.fb.control(service));
    } else {
      // Remove service from the form array
      const index = selectedServices.controls.findIndex(
        (control) => control.value.id === service.id
      );
      if (index !== -1) {
        selectedServices.removeAt(index);
      }
    }
    this.calculateTotal(); // Recalculate the total after changes
  }

  // Submit handler
  onSubmit() {
    this.errorMessage = null;
    this.infoMessage = null;
    if (this.appointmentForm.valid) {
      const appointmentForm = this.appointmentForm.value;

      // convert appointmentForm into Appointment
      const appointmentRequest: AppointmentRequest =
        this.convertAppointmentFormToRequest(appointmentForm, this.totalAmount);

      if (this.editingAppointment) {
        // update appointment
        this.appointmentService.updateAppointment(this.editingAppointment.id, appointmentRequest).subscribe(
          (response) => {
            //this.infoMessage = response.message;
            // go back to list
            this.updated.emit();
          },
          (error) => {
            if (error.error) {
              this.errorMessage = getErrorMessage(error.error);
            }
          }
        );
      } 
    } else {
      this.errorMessage = 'Input is invalid.';
    }
    
  }

  resetForm() {
    const selectedServices = this.appointmentForm.get('selectedServices') as FormArray;  
    // Clear the FormArray
    while (selectedServices.length !== 0) {
      selectedServices.removeAt(0);
    }
    
    // Reset the entire form
    this.appointmentForm.reset();
    
    // Reset the total amount
    this.totalAmount = 0;

    // Explicitly uncheck all checkboxes by reloading services
    this.services = [...this.services]; // Trigger change detection
  }

  convertAppointmentFormToRequest(
    form: AppointmentForm,
    totalAmount: number
  ): AppointmentRequest {
    const appointmentRequest: AppointmentRequest = {
      date: form.date,
      time: form.time,
      technician: {
        id: form.employee,
      },
      customer: {
        phoneNumber: '',
      },
      notes: form.notes,
      invoice: form.selectedServices.length > 0
        ? {
          issuedDate: new Date().toISOString(),
          totalAmount: totalAmount,
          services: form.selectedServices.map((service) => ({ id: service.id, price: service.price })),
        }
        : null,
    };

    return appointmentRequest;
  }

  convertAppointmentResponseToForm(appointmentResponse: AppointmentResponse): AppointmentForm {
    const appointmentForm = {
      id: appointmentResponse.id,
      date: appointmentResponse.date,
      time: appointmentResponse.time,
      employee: appointmentResponse.technician.id,
      selectedServices: appointmentResponse.invoice ? appointmentResponse.invoice.services : [],
      notes: appointmentResponse.notes
    };
    return appointmentForm;
  }

  isServiceSelected(service: NailService): boolean {
    if (!this.editingAppointment || !this.editingAppointment.selectedServices) {
      const selectedServices = this.appointmentForm.get('selectedServices') as FormArray;
      return selectedServices.controls.some((control) => control.value.id === service.id);
    }
    return this.editingAppointment.selectedServices.some(
      (selected) => selected.id === service.id
    );

  }

  onCancel() {
    this.cancel.emit();
  }
}
