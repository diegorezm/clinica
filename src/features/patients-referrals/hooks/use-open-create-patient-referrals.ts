import { create } from "zustand";
type OpenCreatePatientState = {
  isOpen: boolean;
  onOpen: (patientId: number) => void;
  onClose: () => void;
  patientId?: number;
};

export const useOpenCreatePatientReferral = create<OpenCreatePatientState>(
  (set) => ({
    isOpen: false,
    patientId: undefined,
    onOpen: (patientId) => set({ isOpen: true, patientId }),
    onClose: () => set({ isOpen: false, patientId: undefined }),
  }),
);
