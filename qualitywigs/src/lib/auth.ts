import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function withAuth(WrappedComponent: React.ComponentType, { requiredRole }: { requiredRole?: 'admin' | 'employee' } = {}) {
  return function AuthenticatedComponent(props: any) {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!user) {
        router.push('/login')
      } else if (requiredRole && user.role !== requiredRole) {
        router.push('/')
      }
    }, [user, router])

    if (!user || (requiredRole && user.role !== requiredRole)) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

