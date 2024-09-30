import {create} from "zustand";
type OpenUpdateDoctorState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenUpdateDoctor = create<OpenUpdateDoctorState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({isOpen: true, id}),
  onClose: () => set({isOpen: false, id: undefined}),
}));
