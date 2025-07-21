import { create } from "zustand";
import type { Contact } from "./types";

interface ContactStore {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id">) => Contact;
}

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [
    {
      id: "1",
      firstName: "Emilia",
      lastName: "Clarke",
      email: "dorgo@gmail.com",
    },
    {
      id: "2",
      firstName: "Henry",
      lastName: "Cavil",
      email: "witcher@gmail.com",
    },
  ],

  addContact: (contact) => {
    const newContact = { ...contact, id: new Date().toISOString() };
    set((state) => ({
      contacts: [...state.contacts, newContact],
    }));
    return newContact;
  },
}));
