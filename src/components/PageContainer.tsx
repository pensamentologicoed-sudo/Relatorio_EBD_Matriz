import { ReactNode } from "react";
import { motion } from "motion/react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function PageContainer({ children, title, showBack, onBack }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-zinc-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
            )}
            {title && <h1 className="font-bold text-zinc-900 text-xl">{title}</h1>}
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
