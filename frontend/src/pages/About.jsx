import Header from "../components/Header.jsx";

export default function About() {
  return (

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          About <span className="text-blue-600 dark:text-blue-400">CodeGuardian</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-relaxed max-w-3xl mx-auto text-slate-600 dark:text-slate-300">
          CodeGuardian is a secure marketplace platform where buyers and sellers
          can interact with confidence. Every conversation is stored immutably —
          no edits, no deletions — ensuring transparent, tamper-proof proof of
          discussion.
        </p>

        {/* Mission */}
        <div className="mt-12 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            Our Mission
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            To create a fair, modern, and safe environment where digital deals
            are protected by technology, not just trust.
          </p>
        </div>

        {/* Vision */}
        <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-pink-500 dark:text-pink-400">
            Our Vision
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            To be the go-to platform for secure online transactions, making
            dispute resolution effortless and unbiased for everyone.
          </p>
        </div>
      </section>
  );
}
