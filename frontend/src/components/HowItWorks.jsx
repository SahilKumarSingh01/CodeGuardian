export default function HowItWorks() {
  return (
    <section
      id="how"
      className="max-w-5xl mx-auto px-6 py-12 md:py-16"
    >
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-slate-100">
        How It Works
      </h2>

      <ol className="grid md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <li className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold mb-3">
            1
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            Create an Offer
          </h4>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
            Define the project scope, price, and deadline.
          </p>
        </li>

        {/* Step 2 */}
        <li className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300 font-bold mb-3">
            2
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            Negotiate in Chat
          </h4>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
            All messages are locked as evidence to ensure fairness.
          </p>
        </li>

        {/* Step 3 */}
        <li className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-bold mb-3">
            3
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
            Transact Confidently
          </h4>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
            Deliver, review, and complete transactions with proof.
          </p>
        </li>
      </ol>
    </section>
  );
}
