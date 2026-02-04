import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  accessToken: string | null;
  vendorId: string | null;
  plantId: string | null;
  isAuthenticated: boolean;
  isTestMode: boolean;
  userRole: 'technician' | 'admin';
  setSession: (data: {
    accessToken: string;
    vendorId: string;
    plantId: string;
    userRole?: 'technician' | 'admin';
  }) => void;
  clearSession: () => void;
  setTestMode: (enabled: boolean, role?: 'technician' | 'admin') => void;
  setUserRole: (role: 'technician' | 'admin') => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      vendorId: null,
      plantId: null,
      isAuthenticated: false,
      isTestMode: false,
      userRole: 'technician',
      setSession: (data) =>
        set({
          accessToken: data.accessToken,
          vendorId: data.vendorId,
          plantId: data.plantId,
          userRole: data.userRole || 'technician',
          isAuthenticated: true,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          vendorId: null,
          plantId: null,
          isAuthenticated: false,
          userRole: 'technician',
        }),
      setTestMode: (enabled, role = 'technician') =>
        set({
          isTestMode: enabled,
          isAuthenticated: enabled,
          userRole: role,
          vendorId: enabled ? 'ACME Industrial Services' : null,
          plantId: enabled ? 'Plant-01' : null,
        }),
      setUserRole: (role) => set({ userRole: role }),
    }),
    {
      name: 'technician-session',
    }
  )
);
