import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "../components/Link";
import { useRouter } from "../router/RouterContext";

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2 6 10h2.5L4 16h4.5L4 22h7v-3h2v3h7l-4.5-6H20l-4.5-6H18z" />
    </svg>
  );
}

const labelClass =
  "block text-sm font-medium text-gray-700 dark:text-gray-300";
const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/30 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100";

export function Login() {
  const { user, login } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/admin");
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Feil e-post eller passord");
    }
  };

  return (
    <div className="flex flex-col items-center py-10">
      <Link to="/" className="mb-6 flex flex-col items-center gap-2">
        <TreeIcon className="text-forest-700 dark:text-forest-400" />
        <span className="flex flex-col items-center leading-tight">
          <span className="text-lg font-bold text-forest-800 dark:text-forest-200">
            vedtilhytta.no
          </span>
          <span className="text-[11px] tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Administrasjon
          </span>
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-6 text-xl font-bold text-forest-800 dark:text-forest-200">
          Logg inn
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>
              E-post
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className={labelClass}>
              Passord
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold tracking-wide text-white uppercase hover:bg-forest-600"
          >
            Logg inn
          </button>
        </form>
      </div>

      <Link
        to="/"
        className="mt-6 text-sm font-medium text-forest-700 uppercase hover:text-forest-600 dark:text-forest-400 dark:hover:text-forest-300"
      >
        Til nettsiden
      </Link>
    </div>
  );
}
