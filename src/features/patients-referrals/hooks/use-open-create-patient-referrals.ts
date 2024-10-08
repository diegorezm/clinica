import {create} from "zustand";

type OpenCreatePatientState = {
  isOpen: boolean;
  onOpen: (patientId: string) => void;
  onClose: () => void;
  patientId?: string;
};

export const useOpenCreatePatientReferral = create<OpenCreatePatientState>(
  (set) => ({
    isOpen: false,
    patientId: undefined,
    onOpen: (patientId) => set({isOpen: true, patientId}),
    onClose: () => set({isOpen: false, patientId: undefined}),
  }),
);
