import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Clean Drag & Drop Area
 * Sleek obsidian card matching the landing page aesthetic.
 */
export default function DropZone({ onFilesSelected, selectedPeer }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="w-full my-4"
    >
      <input
        type="file"
        id="beam-file-selector"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />
      
      <motion.label
        htmlFor="beam-file-selector"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex flex-col items-center justify-center py-14 px-8 rounded-3xl transition-all duration-300 cursor-pointer select-none group w-full relative overflow-hidden border shadow-lg",
          isDragOver
            ? "bg-[#131520] border-[#ded1b6]/40"
            : "bg-[#0b0c10] border-[#181a26] hover:bg-[#0f1118] hover:border-[#262a3c]"
        )}
      >
        {/* Subtle top subtle accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#ded1b6]/20 to-transparent pointer-events-none" />

        <div className="w-12 h-12 rounded-2xl bg-[#161824] flex items-center justify-center text-[#ded1b6] font-mono text-xl mb-4 group-hover:scale-105 transition-transform duration-300 border border-white/[0.04]">
          ↑
        </div>

        <div className="text-center space-y-2 max-w-md mx-auto">
          <div className="text-base sm:text-lg font-medium tracking-tight text-[#f2f3f7] group-hover:text-[#ded1b6] transition-colors duration-200 font-heading">
            {isDragOver ? "Release to begin transmission" : "Select or drop files to stream"}
          </div>
          <p className="text-xs text-[#888b94] font-normal leading-relaxed">
            Direct device-to-device streaming. Payloads remain solely on your local machine until recipient connection. Zero cloud storage.
          </p>
        </div>

        <div className="mt-6">
          <span className="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-normal tracking-wide bg-[#ffffff] text-[#050506] hover:bg-[#ded1b6] transition-colors duration-200 font-sans shadow-md">
            Select Files
          </span>
        </div>
      </motion.label>
    </div>
  );
}

