import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Grainy Monochromatic Magnetic Bento Card
 * Zero scaling on hover. Features subtle magnetic spring pull as cursor traverses across and outside card boundaries, plus real-time ambient spotlight.
 */
export default function BentoCard({ 
  title, 
  subtitle,
  badge,
  badgeColor = "text-[#ded1b6]",
  badgeBg = "bg-[#1e2238]",
  bgClassName = "bg-gradient-to-br from-[#151828] via-[#0f111d] to-[#0a0b12]",
  className,
  actionText = "DISCOVER MORE",
  actionColor = "text-[#ded1b6]",
  onClick,
  children
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Subtle 2D Magnetic Cursor Pull Physics (gentle ~8px max displacement)
  const springConfig = { damping: 25, stiffness: 140, mass: 0.6 };
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Subtle magnetic pull towards cursor position
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    rawX.set(distanceX * 0.06);
    rawY.set(distanceY * 0.06);
  };

  const handleMouseLeave = () => {
    // Elastic spring pull back to (0, 0) when mouse leaves
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: x,
        y: y,
      }}
      className={cn(
        "rounded-3xl p-8 sm:p-10 film-grain flex flex-col justify-between overflow-hidden relative shadow-none transition-shadow duration-500 cursor-pointer group",
        bgClassName,
        className
      )}
    >
      {/* Content Space */}
      <div className="space-y-4 relative z-10">
        {badge && (
          <div className={cn("inline-flex items-center gap-2 px-3.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider shadow-sm", badgeBg, badgeColor)}>
            {badge}
          </div>
        )}
        <h3 className="text-2xl sm:text-3xl font-medium text-[#ffffff] tracking-tight font-heading group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#959aa8] leading-relaxed max-w-md font-normal">
          {subtitle}
        </p>
        {children}
      </div>

      {/* Sleek Borderless Footer Link */}
      <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs relative z-10 text-[#787c8a] group-hover:text-white transition-colors duration-300">
        <span className={cn("font-medium", actionColor)}>{actionText}</span>
        <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
      </div>
    </motion.div>
  );
}
