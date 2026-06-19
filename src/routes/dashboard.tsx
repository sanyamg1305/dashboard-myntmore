import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../components/dashboard/DashboardPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAdmin,
  component: DashboardPage,
})
