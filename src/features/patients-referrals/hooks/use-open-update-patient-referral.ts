import { create } from "zustand";
type OpenUpdatePatientState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenUpdatePatientReferral = create<OpenUpdatePatientState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: number) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
