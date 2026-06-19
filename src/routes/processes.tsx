import { createFileRoute } from '@tanstack/react-router'
import { ProcessesPage } from '../components/processes/ProcessesPage'
import { requireAdmin } from '@/utils/routeGuards'

export const Route = createFileRoute('/processes')({
  beforeLoad: requireAdmin,
  component: ProcessesPage,
})
