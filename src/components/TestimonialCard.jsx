import { Star, Quote } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  const { name, role, avatar, text, rating } = testimonial;

  return (
    <div className="relative rounded-2xl bg-white dark:bg-dark-900 p-8 shadow-lg">
      <Quote
        size={48}
        className="absolute top-6 right-6 text-brand-500/10 fill-brand-500/10"
      />

      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-16 h-16 rounded-full border-2 border-brand-500 object-cover"
        />
        <div>
          <h4 className="font-semibold text-lg text-dark-900 dark:text-white">
            {name}
          </h4>
          <p className="text-brand-500 text-sm">{role}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating
                ? "fill-brand-500 text-brand-500"
                : "fill-gray-200 text-gray-200 dark:fill-dark-700 dark:text-dark-700"
            }
          />
        ))}
      </div>

      <p className="italic text-dark-600 dark:text-dark-400">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}
