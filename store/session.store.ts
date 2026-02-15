import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  accessToken: string | null;
  vendorId: string | null;
  vendorName: string | null;
  plantId: string | null;
  isAuthenticated: boolean;
  isTestMode: boolean;
  isInvalidated: boolean;
  userRole: 'technician' | 'admin';
  setSession: (data: {
    accessToken: string;
    vendorId: string;
    vendorName?: string;
    plantId: string;
    userRole?: 'technician' | 'admin';
  }) => void;
  clearSession: () => void;
  setTestMode: (enabled: boolean, role?: 'technician' | 'admin') => void;
  setUserRole: (role: 'technician' | 'admin') => void;
  setInvalidated: (val: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      vendorId: null,
      vendorName: null,
      plantId: null,
      isAuthenticated: false,
      isTestMode: false,
      isInvalidated: false,
      userRole: 'technician',
      setSession: (data) =>
        set({
          accessToken: data.accessToken,
          vendorId: data.vendorId,
          vendorName: data.vendorName || null,
          plantId: data.plantId,
          userRole: data.userRole || 'technician',
          isAuthenticated: true,
          isInvalidated: false,
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
          isInvalidated: false,
        }),
      setUserRole: (role) => set({ userRole: role }),
      setInvalidated: (val) => set({ isInvalidated: val }),
    }),
    {
      name: 'technician-session',
    }
  )
);
