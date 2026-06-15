// hooks/useAuth.ts
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export interface AuthUser {
    id: string
    email: string
    phone: string
    roles: string[]
    emailVerified: boolean
    twoFactorEnabled: boolean
    isActive: boolean
    isSuspended: boolean
    preferredLanguage: string
    timezone: string
    lastLoginAt: string
}

interface UseAuthReturn {
    user: AuthUser | null
    loading: boolean
    isAuthenticated: boolean
    logout: () => void
}

export const useAuth = (): UseAuthReturn => {
    const router = useRouter()
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    setLoading(false)
                    return
                }

                // Validar token con el backend
                const response = await fetch("http://localhost:3000/api/auth/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    // Token inválido o expirado
                    localStorage.removeItem("token")
                    localStorage.removeItem("user")
                    setLoading(false)
                    return
                }

                const data = await response.json()
                const userData = data.data?.user || data.user

                setUser(userData)
                localStorage.setItem("user", JSON.stringify(userData))
            } catch (error) {
                console.error("Error validating token:", error)
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            } finally {
                setLoading(false)
            }
        }

        validateToken()
    }, [])

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        router.push("/login")
    }

    return {
        user,
        loading,
        isAuthenticated: !!user,
        logout,
    }
}