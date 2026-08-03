import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "../components/Link";
import { useRouter } from "../router/RouterContext";

const labelClass =
  "block text-sm font-medium text-gray-700";
const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/30";

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
        <img
          src="/img/logo.png"
          alt="vedtilhytta.no – god ved, godt hytteliv"
          width={497}
          height={120}
          className="h-12 w-auto"
        />
        <span className="text-[11px] tracking-wide text-gray-500 uppercase">
          Administrasjon
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-forest-800">
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
            <p className="text-sm text-red-600">{error}</p>
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
        className="mt-6 text-sm font-medium text-forest-700 uppercase hover:text-forest-600"
      >
        Til nettsiden
      </Link>
    </div>
  );
}
