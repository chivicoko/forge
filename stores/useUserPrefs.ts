import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserPrefsState {
  rateId: string
  setRateId: (id: string) => void
}

export const useUserPrefs = create<UserPrefsState>()(
  persist(
    (set) => ({
      rateId: "",
      setRateId: (id) => set({ rateId: id }),
    }),
    { name: "forge-prefs" }
  )
)
