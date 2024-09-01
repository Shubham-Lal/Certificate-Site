import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    isAuthenticated: 'authenticating', // authenticating, authenticated, failed
    setIsAuthenticated: (status) => set({ isAuthenticated: status })
}))