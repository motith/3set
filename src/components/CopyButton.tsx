import React, { useState } from 'react';
import { CopyIcon } from '../icons/CopyIcon';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  label = "コピー", 
  className = "",
  size = "md"
}) => {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]',
    lg: 'px-4 py-2 text-sm sm:text-base min-h-[40px] sm:min-h-[44px]'
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピーに失敗しました:', error);
      // フォールバック: 古いブラウザ対応
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center space-x-2 rounded-lg font-medium transition-all duration-200
        ${copied 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
        }
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={copied}
      aria-label={`${label}ボタン`}
    >
      <CopyIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="truncate">{copied ? 'コピー完了！' : label}</span>
    </button>
  );
}; 