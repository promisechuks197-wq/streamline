import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-dark-900 dark:bg-dark-950 rounded-3xl py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl text-white mb-3">
          Stay in the Loop
        </h2>
        <p className="text-dark-400 mb-8">
          Subscribe for exclusive drops, deals, and style inspiration
        </p>

        {subscribed ? (
          <p className="text-brand-500 font-medium text-lg">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-xl bg-dark-800 border border-dark-700 text-white px-4 py-3 placeholder-dark-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-colors"
            >
              Subscribe
              <Send size={18} />
            </button>
          </form>
        )}

        <p className="text-dark-500 text-sm mt-4">No spam, unsubscribe anytime</p>
      </div>
    </section>
  );
}
