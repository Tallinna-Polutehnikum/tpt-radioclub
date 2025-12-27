import { createContext, useContext } from "react"

export type Role = "admin" | "editor" | "user"

export interface AuthUser {
  uid: string
  email: string | null
}

export interface AuthContextType {
  user: AuthUser | null
  role: Role | null
  permissions: string[]
  loading: boolean
  refreshClaims: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
