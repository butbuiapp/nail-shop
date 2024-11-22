import { NailService } from "./nail-service.model";

// Define Invoice interface
export interface Invoice {
  id: number;
  issuedDate: string;             // ISO string format (e.g., "2023-11-09T15:30:00Z")
  totalAmount: number;
  paidDate: string | null;         // Nullable if paidDate is not always present
  services: NailService[];         // Array of NailService objects
  status: InvoiceStatusEnum;       // Enum for status
}

// Define the InvoiceStatusEnum enum
export enum InvoiceStatusEnum {
  DRAFT = 'DRAFT',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  PAID = 'PAID',
  DELETED = 'DELETED',
}