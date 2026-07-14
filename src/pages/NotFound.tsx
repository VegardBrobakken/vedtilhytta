import { Link } from "../components/Link";

export function NotFound() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <p className="text-5xl font-bold text-forest-700">404</p>
      <p className="mt-2 text-gray-600">Siden du leter etter finnes ikke.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-forest-700 px-4 py-2 font-medium text-white hover:bg-forest-600"
      >
        Til forsiden
      </Link>
    </div>
  );
}
