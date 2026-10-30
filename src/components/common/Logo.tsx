import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showSubtitle = false,
}) => {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon: Modern aerodynamic e-commerce navigational pilot arrow + store grid */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#E10600] to-[#B80500] text-white shadow-sm shadow-red-500/20"
        style={{ width: iconSize + 10, height: iconSize + 10 }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Compass / Pilot arrow flying through shopping node */}
          <path d="m12 3-8 15 8-4 8 4-8-15Z" fill="white" fillOpacity="0.2" />
          <circle cx="12" cy="11" r="2" fill="white" />
          <path d="M4 18h16" strokeOpacity="0.5" strokeWidth="1.5" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#168BCE] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#168BCE]"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span className={`font-extrabold ${textSize} text-[#37474F]`}>
            Store<span className="text-[#E10600]">Pilot</span>
          </span>
          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-50 text-[#E10600] border border-red-100">
            SaaS
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-[#455A64]/80 tracking-wide mt-0.5">
            E-Commerce Operations Command
          </span>
        )}
      </div>
    </div>
  );
};
