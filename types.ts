export enum Role {
  SANTRI = 'SANTRI',
  ORANG_TUA = 'ORANG_TUA',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  childId?: string; 
}

export interface HealthRecord {
  id: string;
  santriId: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  recommendation: string;
}

export interface FuzzyRule {
  id: string;
  symptoms: string[];
  diagnosis: string;
  recommendation: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export enum Page {
    HOME = 'HOME',
    LOGIN = 'LOGIN',
    SANTRI_DASHBOARD = 'SANTRI_DASHBOARD',
    SCREENING = 'SCREENING',
    HISTORY = 'HISTORY',
    EDUCATION = 'EDUCATION',
    ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
    PARENT_DASHBOARD = 'PARENT_DASHBOARD',
    ADMIN_MANAGE_RULES = 'ADMIN_MANAGE_RULES',
}