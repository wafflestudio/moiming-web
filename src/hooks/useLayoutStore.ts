import { create } from 'zustand';

interface LayoutState {
  isSubheaderActive: boolean;
  setSubheaderActive: (active: boolean) => void;
}

const useLayoutStore = create<LayoutState>((set) => ({
  isSubheaderActive: false,
  setSubheaderActive: (active) => set({ isSubheaderActive: active }),
}));

export default useLayoutStore;
