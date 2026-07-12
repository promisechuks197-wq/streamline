import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  const { name, slug, image, count } = category;

  return (
    <Link
      to={`/shop?category=${slug}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 dark:bg-dark-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80 group-hover:via-black/30" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="font-display font-bold text-2xl text-white mb-1 transition-transform duration-300 group-hover:translate-y-[-2px]">
          {name}
        </h3>
        <p className="text-white/70 text-sm">
          {count} {count === 1 ? 'Product' : 'Products'}
        </p>
      </div>
    </Link>
  );
}
