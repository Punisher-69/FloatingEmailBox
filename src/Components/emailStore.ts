import { create } from "zustand";

interface EmailState {
  to: string;
  cc: string[];
  subject: string;
  editorValue: string;
  setTo: (to: string) => void;
  setCc: (cc: string[]) => void;
  setSubject: (subject: string) => void;
  setEditorValue: (value: string) => void;
  reset: () => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  to: "",
  cc: [],
  subject: "",
  editorValue: "",
  setTo: (to) => set({ to }),
  setCc: (cc) => set({ cc }),
  setSubject: (subject) => set({ subject }),
  setEditorValue: (editorValue) => set({ editorValue }),
  reset: () => set({ to: "", cc: [], subject: "", editorValue: "" }),
}));
