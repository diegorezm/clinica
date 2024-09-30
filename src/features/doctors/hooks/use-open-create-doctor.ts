import {create} from "zustand";
type OpenCreateDoctorState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useOpenCreateDoctor = create<OpenCreateDoctorState>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
}));
