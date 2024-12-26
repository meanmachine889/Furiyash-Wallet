'use client'

import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Mnemonics({ mnemonic }: { mnemonic: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const words = mnemonic.split(" ");

  return (
    <div className="flex flex-col gap-3 sm:gap-5 border items-start justify-start max-h-[100%] rounded-xl p-3 sm:p-5">
      <div className="flex justify-between items-center w-full">
        <p className="text-xl sm:text-2xl md:text-3xl font-medium">Seed Phrase</p>
        <div className="flex gap-3 sm:gap-7 items-center">
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className="focus:outline-none"
            aria-label={isVisible ? "Hide seed phrase" : "Show seed phrase"}
          >
            {isVisible ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>
      <div className="flex justify-center w-full">
        {isVisible && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
            >
              {words.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-zinc-900 rounded-lg p-2 sm:py-3 sm:px-3 md:py-4 md:px-4"
                >
                  <p className="text-sm sm:text-base md:text-lg text-gray-400">{word}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

