// src/auth/AuthProvider.tsx
import {
  onAuthStateChanged,
  getIdTokenResult,
  type User,
} from "firebase/auth"
import { type ReactNode, useEffect, useState } from "react"
import { auth } from "./auth"
import { AuthContext, type AuthContextType, type Role } from "./AuthContext"

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const extractClaims = async (firebaseUser: User) => {
    const tokenResult = await getIdTokenResult(firebaseUser, true)
    const claims = tokenResult.claims

    setRole((claims.role as Role) ?? "user")
    setPermissions((claims.permissions as string[]) ?? [])
  }

  const refreshClaims = async () => {
    if (!auth.currentUser) return
    await extractClaims(auth.currentUser)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setPermissions([])
        setLoading(false)
        return
      }

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      })

      await extractClaims(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    user,
    role,
    permissions,
    loading,
    refreshClaims,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
