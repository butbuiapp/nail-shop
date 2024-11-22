import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { type NailService } from '../../../model/nail-service.model';
import { NailServiceService } from '../../../service/nail-service.service';
import { CommonModule } from '@angular/common';
import { getErrorMessage } from '../../../common/constants';

@Component({
  selector: 'app-new-service',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.css'
})
export class NewServiceComponent {
  @Input() editingService: NailService | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() serviceAdded = new EventEmitter<void>(); // Emits an event when a service is added

  nailServiceForm!: FormGroup;

  errorMessage: string | null = null; // To store the error message

  private formBuilder = inject(FormBuilder);
  private nailServiceService = inject(NailServiceService);

  ngOnInit(): void {
    this.nailServiceForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/), this.maxDigitsValidator(3)]],
      duration: ['', [Validators.required, Validators.pattern(/^\d+$/), this.maxDigitsValidator(3)]],
      description: ['']
    });
    // If editing, populate form with existing data
    if (this.editingService) {
      this.nailServiceForm.patchValue(this.editingService);
    }
  }

  maxDigitsValidator(max: number) {
    return (control: any) => {
      const value = control.value;
      if (value && value.toString().length > max) {
        return { maxDigits: true };
      }
      return null;
    };
  }

  onSubmit() {
    this.errorMessage = ''; // Reset any previous error message
    if (this.nailServiceForm.valid) {
      const nailService: NailService = this.nailServiceForm.value;
      
      if (this.editingService) {
        // Update existing service
        this.nailServiceService.updateService(this.editingService.id, nailService).subscribe(
          () => {
            this.serviceAdded.emit();
          },
          (error) => {
            if (error.error) {
              this.errorMessage = getErrorMessage(error.error);
            } else {
              this.errorMessage = 'Failed to update service. Please try again later.';
            }
          }
        );
      } else {
        // Add new service
        this.nailServiceService.addService(nailService).subscribe(
          () => {
            this.serviceAdded.emit(); // Notify parent component
          },
          (error) => {
            if (error.error) {
              this.errorMessage = Object.keys(error.error)
                .map(key => error.error[key])
                .join('<br>');
            } else {
              this.errorMessage = 'Failed to add service. Please try again later.';
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
