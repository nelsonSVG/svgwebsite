export enum ProjectCategory {
  ALL = 'all',
  WEB = 'web',
  BRANDING = 'branding',
  APPS = 'apps',
  UIUX = 'uiux'
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  description: string;
  client: string;
  year: string;
  services: string[];
  images: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
}

// Billing Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void' | 'migrated';

export interface Client {
  id: string;
  name: string;
  email: string;
  language_preference: string;
  payment_preference: string;
  company_name?: string;
  tax_id?: string;
  address?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  issue_date: string;
  due_date: string;
  payment_method_preference: string;
  epayco_link?: string;
  epayco_session_id?: string;
  bank_transfer_info?: any;
  pdf_url?: string;
  pdf_storage_path?: string;
  is_test: boolean;
  is_recurring: boolean;
  recurrence_rule?: string;
  next_billing_date?: string;
  manually_marked_paid: boolean;
  paid_at?: string;
  language: string;
  created_at: string;
  updated_at: string;
  // Join fields
  client?: Client;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface InvoiceEvent {
  id: string;
  invoice_id: string;
  event_type: string;
  occurred_at: string;
  metadata: any;
  created_at: string;
}
