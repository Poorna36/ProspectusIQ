import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-[var(--navy)]">
          PROSPECTUS IQ
        </Link>

        <div className="flex items-center gap-6 text-sm text-gray-700">
          <a href="#features">Features</a>
          <a href="#how">How it Works</a>
          <Link
            to="/login"
            className="rounded-lg bg-[var(--blue)] px-4 py-2 text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}