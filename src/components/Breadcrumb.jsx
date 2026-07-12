import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav className="py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li className="flex items-center gap-2">
          <Link
            to="/"
            className="text-dark-500 hover:text-brand-500 transition-colors"
          >
            <Home size={16} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-dark-500" />
              {isLast ? (
                <span className="text-dark-900 dark:text-white font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-dark-500 hover:text-brand-500 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
