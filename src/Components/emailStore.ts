import { create } from "zustand";
import { nanoid } from 'nanoid'
export interface EmailBox {
  id: string;
  isMinimized: boolean;
  to: string;
  cc: string[];
  subject: string;
  editorValue: string;
}

interface EmailStore {
  boxes: EmailBox[];
  addBox: () => void;
  removeBox: (id: string) => void;
  updateBox: (id: string, updates: Partial<EmailBox>) => void;
}



export const useEmailStore = create<EmailStore>((set) => ({
  boxes: [],
  addBox: () =>
    set((state) => ({
      boxes: [
        ...state.boxes,
        {
          id: nanoid(),
          isMinimized: false,
          to: "",
          cc: [],
          subject: "",
          editorValue: "",
        } as EmailBox ,
      ],
    })),
  removeBox: (id) =>
    set((state) => ({
      boxes: state.boxes.filter((box) => box.id !== id),
    })),
  updateBox: (id, updates) =>
    set((state) => ({
      boxes: state.boxes.map((box) =>
        box.id === id ? { ...box, ...updates } : box
      ),
    })),
}));
