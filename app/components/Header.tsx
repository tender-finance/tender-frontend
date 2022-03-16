import { Link } from "remix";
export default function Header() {
  return (
    <div className="flex m-auto max-w-6xl mt-8 px-4">
      <div className="flex-grow">
        <img src="/images/logo.svg" alt="Tender Finance" />
      </div>
      <div>
        <button className="bg-brand-green text-white py-2 px-4">
          <Link to="/app">Enter App</Link>
        </button>
      </div>
    </div>
  );
}
