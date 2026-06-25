import { useState } from 'react'
import { Link } from './Link'

const navLinks = [
  { to: '/', label: 'Hjem' },
  { to: '/veden-var', label: 'Veden vår' },
  { to: '/priser', label: 'Priser' },
  { to: '/levering', label: 'Levering' },
  { to: '/om-oss', label: 'Om oss' },
  { to: '/bestill', label: 'Bestill ved' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        {/* Logo placeholder */}
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gray-200 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            LOGO
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Meny"
          aria-expanded={open}
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="flex flex-col gap-1 border-t border-gray-200 p-4 md:hidden dark:border-gray-800"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
