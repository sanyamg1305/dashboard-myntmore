import { createFileRoute, redirect } from '@tanstack/react-router'

// Role-based redirect happens in __root.tsx AppLayout via useEffect.
// This static redirect handles the base case (non-client users go to dashboard).
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})
