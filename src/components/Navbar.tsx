import { useState } from "react";
import { Link } from "./Link";

const navLinks = [
  { to: "/", label: "Hjem" },
  { to: "/veden-var", label: "Veden vår" },
  { to: "/priser", label: "Priser" },
  { to: "/levering", label: "Levering" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/img/logo.png"
            alt="vedtilhytta.no – god ved, godt hytteliv"
            width={497}
            height={120}
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-700 uppercase hover:text-forest-700"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/bestill"
            className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white uppercase hover:bg-forest-600"
          >
            Bestill ved
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Meny"
          aria-expanded={open}
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
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
          className="flex flex-col gap-1 border-t border-gray-200 p-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 uppercase hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/bestill"
            className="mt-1 rounded-md bg-forest-700 px-2 py-2 text-center text-sm font-semibold text-white uppercase hover:bg-forest-600"
          >
            Bestill ved
          </Link>
        </div>
      )}
    </nav>
  );
}
