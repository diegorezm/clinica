import { create } from "zustand";
type OpenUpdateDoctorState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenUpdateDoctor = create<OpenUpdateDoctorState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: number) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
