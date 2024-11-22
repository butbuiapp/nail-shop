import { Component, inject, OnInit } from '@angular/core';
import { NailServiceService } from '../../service/nail-service.service';
import { CurrencyPipe } from '@angular/common';
import { NewServiceComponent } from './new-service/new-service.component';
import { type NailService } from '../../model/nail-service.model';

@Component({
  selector: 'app-nail-services',
  standalone: true,
  imports: [CurrencyPipe, NewServiceComponent],
  templateUrl: './nail-services.component.html',
  styleUrl: './nail-services.component.css'
})
export class NailServicesComponent implements OnInit {
  nailServices : any[] = [];  
  isAddingService: boolean = false;
  editingService: NailService | null = null;
  errorMessage: string | null = null;
  inforMessage: string | null = null;

  private nailServiceService = inject(NailServiceService);

  ngOnInit(): void {
    this.loadNailServices();    
  }

  loadNailServices() {
    this.nailServiceService.getNailServices().subscribe(
      (response) => {
        this.nailServices = response;
      },
      (error) => {
        this.errorMessage = 'Failed to load services.'
      }
    );
  }

  onStartAddService() {
    this.isAddingService = true;
  }

  onCloseAddService() {
    this.isAddingService = false;
    this.editingService = null;
  }

  onServiceAdded() {
    this.onCloseAddService();
    this.loadNailServices(); // Refresh the list of services
  }

  onEditService(service: NailService) {
    this.editingService = service;
    this.isAddingService = true; // Show the form with the current service data
  }

  onDeleteService(serviceId: number) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.nailServiceService.deleteService(serviceId).subscribe(
        (response) => {
          this.nailServices = this.nailServices.filter(s => s.id !== serviceId);
          this.inforMessage = response.message;
        },
        (error) => {
          this.errorMessage = 'Failed to delete service. Please try again later.';
        }
      );
    }
  }
}
