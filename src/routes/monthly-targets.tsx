import { createFileRoute } from '@tanstack/react-router'
import { MonthlyProgressPage } from '../components/monthly/MonthlyProgressPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/monthly-targets')({
  beforeLoad: requireAdmin,
  component: MonthlyProgressPage,
})
