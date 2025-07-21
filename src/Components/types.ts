export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
} 