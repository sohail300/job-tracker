 import { Link } from "react-router-dom";
 import { Briefcase, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
 import ThemeToggle from "../components/ThemeToggle";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header (simple) */}
      <header className="glass border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-xl">
              <Briefcase className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-lg font-bold gradient-text">Job Application Tracker</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle />
          </div>
          <div className="sm:hidden flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary-700/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),rgba(17,24,39,0))]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border bg-white/60 dark:bg-gray-800/60 glass">
                <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Track every application with clarity</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100">
                Stay on top of your 
                <span className="block gradient-text leading-relaxed">job search.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                A fast, and organized way to manage applications, interviews, and follow-ups.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link to="/login" className="btn-primary inline-flex items-center justify-center">
                  Track Applications
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary-600/20 to-primary-400/10 rounded-3xl blur-2xl -z-10" />
              <div className="card p-0 overflow-hidden rounded-3xl shadow-large">
                <div className="bg-gray-100 dark:bg-gray-700 h-10 flex items-center px-4 space-x-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="grid gap-4 sm:gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-xl">
                          <Briefcase className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="font-semibold">Applications</span>
                      </div>
                      <div className="h-8 w-24 skeleton" />
                    </div>
                    <div className="h-24 skeleton rounded-xl" />
                    <div className="h-24 skeleton rounded-xl" />
                    <div className="h-24 skeleton rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;


