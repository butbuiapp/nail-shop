import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { type Employee } from '../../../model/employee.model';
import { EmployeeService } from '../../../service/employee.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getErrorMessage } from '../../../common/constants';

@Component({
  selector: 'app-new-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-employee.component.html',
  styleUrl: './new-employee.component.css'
})
export class NewEmployeeComponent {
  @Input() editingEmployee : Employee | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() employeeAdded = new EventEmitter<void>();

  errorMessage: string | null = null;
  employeeForm! : FormGroup;
  private formBuilder = inject(FormBuilder);
  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    
    // If editing, populate form with existing data
    if (this.editingEmployee) {
      this.employeeForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        email: ['', [Validators.email]],
        dob: ['', []],
        password: ['xxxxxxxx', []],
        role: ['', Validators.required],
      });
      this.employeeForm.patchValue(this.editingEmployee);
    } else {
      this.employeeForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        email: ['', [Validators.email]],
        dob: ['', []],
        password: ['', [Validators.required, Validators.minLength(8)]],
        role: ['', Validators.required],
      });
      this.employeeForm.patchValue({ role: 'TECHNICIAN' });
    }
  }

  onSubmit() {
    this.errorMessage = null; // Reset any previous error message
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;
      
      if (this.editingEmployee) {
        // Update 
        this.employeeService.updateEmployee(this.editingEmployee.id, employee).subscribe(
          () => {
            this.employeeAdded.emit();
          },
          (error) => {
            if (error.error) {
              this.errorMessage = getErrorMessage(error.error);
            } else {
              this.errorMessage = 'Failed to update employee. Please try again later.';
            }
          }
        );
      } else {
        // Add new employee
        this.employeeService.addEmployee(employee).subscribe(
          () => {
            this.employeeAdded.emit(); // Notify parent component
          },
          (error) => {
            if (error.error) {
              this.errorMessage = Object.keys(error.error)
                .map(key => error.error[key])
                .join('<br>');
            } else {
              this.errorMessage = 'Failed to add employee. Please try again later.';
            }           
          }
        );
      }
    } else {
      this.errorMessage = 'Input is invalid.';
    }
  }

  onCancel() {
    this.close.emit();
  }
}
