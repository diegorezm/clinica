import {create} from "zustand";
type OpenUpdatePatientState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenUpdatePatient = create<OpenUpdatePatientState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({isOpen: true, id}),
  onClose: () => set({isOpen: false, id: undefined}),
}));
