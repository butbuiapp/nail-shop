import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { Employee } from '../../model/employee.model';
import { NewEmployeeComponent } from "./new-employee/new-employee.component";

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [NewEmployeeComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employees : any[] = [];
  errorMessage : string | null = null;
  inforMessage: string | null = null;

  isAddingEmployee: boolean = false;
  editingEmployee: Employee | null = null;
  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
      this.loadEmployees();
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

  onStartAdd() {
    this.isAddingEmployee = true;
  }

  onClose() {
    this.isAddingEmployee = false;
    this.editingEmployee = null;
  }

  onAdded() {
    this.onClose();
    this.loadEmployees(); // Refresh the list
  }

  onEdit(employee: Employee) {
    this.editingEmployee = employee;
    this.isAddingEmployee = true; // Show the form with the current data
  }

  onDelete(serviceId: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(serviceId).subscribe(
        (response) => {
          this.employees = this.employees.filter(s => s.id !== serviceId);
          this.inforMessage = response.message;
        },
        (error) => {
          this.errorMessage = 'Failed to delete employee. Please try again later.';
        }
      );
    }
  }
}
