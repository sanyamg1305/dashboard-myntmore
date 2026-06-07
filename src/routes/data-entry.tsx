import { createFileRoute } from '@tanstack/react-router'
import { DataEntryHub } from '../components/data-entry/DataEntryHub'

export const Route = createFileRoute('/data-entry')({
  component: DataEntryHub,
})
