import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface ButtonCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onClick: () => void;
  className?: string;
}

export const ButtonCard: React.FC<ButtonCardProps> = ({ title, subtitle, icon: Icon, onClick, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-6 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4 text-left hover:shadow-md transition-shadow ${className}`}
    >
      {Icon && (
        <div className="p-3 bg-zinc-50 rounded-xl text-zinc-600">
          <Icon size={24} />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-zinc-900 text-lg">{title}</h3>
        {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
      </div>
    </motion.button>
  );
}
