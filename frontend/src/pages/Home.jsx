import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        text-slate-800 dark:text-slate-100
      "
    >
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}
