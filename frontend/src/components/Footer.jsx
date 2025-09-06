export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 mt-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            CodeGuardian
          </span>
          . All rights reserved.
        </p>
        
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
