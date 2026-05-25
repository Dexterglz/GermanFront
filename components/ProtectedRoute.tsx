import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
    children: ReactNode
    requiredRoles?: string[]
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    const router = useRouter()
    const { user, loading, isAuthenticated } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Validando sesión...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        router.replace("/login")
        return null
    }

    // Validar roles si se especifican
    if (requiredRoles && user) {
        const hasRequiredRole = user.roles.some((role) =>
            requiredRoles.includes(role)
        )

        if (!hasRequiredRole) {
            router.replace("/unauthorized")
            return null
        }
    }

    return <>{children}</>
}