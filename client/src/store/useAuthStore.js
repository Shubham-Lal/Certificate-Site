import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    isAuthenticated: false,
    setIsAuthenticated: (status) => set({ isAuthenticated: status }),
    user: { email: '' },
    setUser: (data) => set({ user: data })
}))