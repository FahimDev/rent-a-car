// Removed edge runtime for Prisma compatibility

import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/login')
}
