import {create} from "zustand";
type OpenCreatePatientState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOpenCreatePatient = create<OpenCreatePatientState>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
}));
