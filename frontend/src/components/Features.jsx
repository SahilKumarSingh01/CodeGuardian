import { ShieldCheck, Zap, Scale } from "lucide-react"; // optional icons

export default function Features() {
  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-6 py-12 md:py-16"
    >
      <div className="grid md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Immutable Proof
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Chat logs cannot be edited or deleted. Perfect for dispute resolution.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-500 dark:text-pink-300 mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Fast & Modern
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Built on MERN + Tailwind v4 for a sleek, responsive experience.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Fair by Design
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Clear evidence trails keep both parties honest and protected.
          </p>
        </div>
      </div>
    </section>
  );
}
