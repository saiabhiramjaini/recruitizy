// types.ts
export interface AdminProfile {
  username: string;
  email: string;
}

export interface HR {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Company {
  id: number;
  name: string;
  about: string;
  companySize: number;
  locations: string[];
  headquarters: string;
  foundedYear: number;
  coreTechnologies: string[];
  industry: string;
  website: string;
  linkedIn: string;
  twitter: string;
  facebook: string;
  instagram: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  hrs: HR[];
}

export interface ApiResponse<T> {
  msg: string;
  data?: T;
  hrs?: T[];
  company?: T;
}