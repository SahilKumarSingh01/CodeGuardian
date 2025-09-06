export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
      {/* Hero Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Secure deals,{" "}
        <span className="text-pink-500 dark:text-pink-400">immutable</span> chats.
      </h1>

      {/* Hero Description */}
      <p className="mt-4 md:mt-6 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        CodeGuardian is a safe marketplace for buyers and sellers. Every conversation is stored
        as tamper-proof evidence — no edits, no deletions — so you’re always protected.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          Get Started
        </a>
        <a
          href="#features"
          className="px-6 py-3 rounded-xl bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          See Features
        </a>
      </div>
    </section>
  );
}
