import { Navbar } from './Navbar'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-5xl p-4 sm:p-6">{children}</main>
    </div>
  )
}
