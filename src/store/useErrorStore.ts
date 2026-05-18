import { create } from 'zustand'

interface ErrorEntry {
  message: string
  title?: string
}

interface ErrorStore {
  errors: Record<string, ErrorEntry>
  setError: (params: { menuName: string; errorMessage: string; title?: string }) => void
  clearError: (menuName: string) => void
  clearAllErrors: () => void
}

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: {},
  setError: ({ menuName, errorMessage, title }) =>
    set((state) => ({
      errors: { ...state.errors, [menuName]: { message: errorMessage, title } },
    })),
  clearError: (menuName) =>
    set((state) => {
      const next = { ...state.errors }
      delete next[menuName]
      return { errors: next }
    }),
  clearAllErrors: () => set({ errors: {}  }),
}))
