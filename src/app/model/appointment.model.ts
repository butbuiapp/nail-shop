import { Customer } from "./customer.model";
import { Employee } from "./employee.model";
import { Invoice } from "./invoice.model";
import { NailService } from "./nail-service.model";

// Define AppointmentRequestDto interface
export interface AppointmentRequest {
  date: string;
  time: string;
  customer: {
    phoneNumber: string;
  }
  technician: {
    id: number;
  };
  notes: string;
  invoice: {
    issuedDate: string;
    totalAmount: number;
    services: {id: number; price: number}[]
  } | null
}

// Define AppointmentResponseDto interface
export interface AppointmentResponse {
  id: number;
  date: string;
  time: string;
  customer: Customer
  technician: Employee;
  notes: string;
  invoice: Invoice | null;
  status: AppointmentStatusEnum;
}

export interface AppointmentSearch {
  appointmentDate: Date;
}

export interface AppointmentForm {
  id: number;
  date: string;
  time: string;
  employee: number;
  selectedServices: NailService[];
  notes: string;
}

export enum AppointmentStatusEnum {
  BOOKED = "BOOKED",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
  DELETED = "DELETED"
}
