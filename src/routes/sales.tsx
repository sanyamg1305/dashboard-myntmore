import { createFileRoute } from '@tanstack/react-router'
import { SalesOutreachPage } from '../components/sales/SalesPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/sales')({
  beforeLoad: requireAdmin,
  component: SalesOutreachPage,
})
