import { createFileRoute } from '@tanstack/react-router'
import { ReportsPage } from '../components/reports/ReportsPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/reports')({
  beforeLoad: requireAdmin,
  component: ReportsPage,
})
