import React from 'react';

interface GlassCardProProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

export default function GlassCardPro({
  title,
  children,
  className = '',
  variant = 'default'
}: GlassCardProProps) {
  const variantClasses = {
    default: 'border-white/10 from-gray-800/30 to-gray-900/30',
    critical: 'border-red-500/30 from-red-950/30 to-gray-900/30 animate-pulse',
    warning: 'border-amber-500/30 from-amber-950/20 to-gray-900/30',
    success: 'border-emerald-500/30 from-emerald-950/20 to-gray-900/30'
  };

  return (
    <div 
      className={`group rounded-2xl overflow-hidden backdrop-blur-2xl 
                 bg-gradient-to-br ${variantClasses[variant]}
                 border shadow-2xl shadow-black/40 transition-all duration-300
                 hover:shadow-3xl hover:shadow-black/50 hover:-translate-y-0.5
                 ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-white/5 bg-black/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white flex items-center">
            {variant === 'critical' && (
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
            )}
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}