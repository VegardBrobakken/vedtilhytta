import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function PublicLayout({
  children,
  contained = true,
}: {
  children: React.ReactNode
  contained?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1">
        {contained ? (
          <div className="mx-auto max-w-5xl p-4 sm:p-6">{children}</div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  )
}
