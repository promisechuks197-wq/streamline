import { Star, ThumbsUp } from "lucide-react";

export default function ReviewCard({ review }) {
  const { author, date, rating, title, content, helpful } = review;

  return (
    <div className="rounded-xl border border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-dark-900 dark:text-white">
          {author}
        </span>
        <span className="text-sm text-dark-500">{date}</span>
      </div>

      <div className="flex gap-1 mb-3">
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

      <h4 className="font-semibold text-dark-900 dark:text-white mb-2">
        {title}
      </h4>

      <p className="text-dark-600 dark:text-dark-400 mb-4">{content}</p>

      <div className="flex items-center gap-3 pt-3 border-t border-dark-100 dark:border-dark-800">
        <ThumbsUp size={16} className="text-dark-500" />
        <span className="text-sm text-dark-500">
          {helpful || 0} people found this helpful
        </span>
        <button className="ml-auto text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
          Helpful
        </button>
      </div>
    </div>
  );
}
