'use client';

import { Volume2 } from 'lucide-react';
import { useCallback } from 'react';

interface SpeakButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SpeakButton({ text, className = '', size = 'md' }: SpeakButtonProps) {
  const speak = useCallback(() => {
    if (typeof window === 'undefined') return;
    const synth = window?.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    synth.speak(utterance);
  }, [text]);

  const sizes = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors ${sizes[size]} ${className}`}
      aria-label={`Pronuncia ${text}`}
      title="Ascolta la pronuncia"
    >
      <Volume2 className={iconSizes[size]} />
    </button>
  );
}
