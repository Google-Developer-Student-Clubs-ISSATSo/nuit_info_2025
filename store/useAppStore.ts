import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  xp: number;
  route: 'freedom' | 'traditional' | null;
  role: 'professor' | 'administration' | 'student' | null;
  addXp: (amount: number) => void;
  setRoute: (route: 'freedom' | 'traditional') => void;
  setRole: (role: 'professor' | 'administration' | 'student') => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      xp: 0,
      route: null,
      role: null,
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      setRoute: (route) => set({ route }),
      setRole: (role) => set({ role }),
      reset: () => set({ xp: 0, route: null, role: null }),
    }),
    {
      name: 'nuit-info-storage',
    }
  )
);
