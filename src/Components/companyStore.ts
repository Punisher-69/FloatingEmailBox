import { create } from "zustand";
import type { Company } from "./types";

interface CompanyState {
  companies: Company[];
  addCompany: (company: Omit<Company, "id">) => Company;
}

const initialCompanies: Company[] = [
  { id: "1", name: "Acme Inc.", website: "acme.com" },
  { id: "2", name: "Stark Industries", website: "starkindustries.com" },
  { id: "3", name: "Wayne Enterprises", website: "wayne-enterprises.com" },
];

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: initialCompanies,
  addCompany: (company) => {
    const newCompany = { ...company, id: new Date().toISOString() };
    set((state) => ({
      companies: [...state.companies, newCompany],
    }));
    return newCompany;
  },
}));
