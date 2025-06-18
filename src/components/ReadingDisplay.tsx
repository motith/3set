import { useRef, useImperativeHandle, forwardRef } from 'react';
import { ReadingOutput } from '../types';
import { CopyButton } from './CopyButton';

interface ReadingDisplayProps {
  reading: ReadingOutput;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export interface ReadingDisplayRef {
  scrollToCard: (cardPosition: 'A' | 'B' | 'C') => void;
}

export const ReadingDisplay = forwardRef<ReadingDisplayRef, ReadingDisplayProps>(({
  reading,
  onRegenerate,
  isRegenerating
}, ref) => {
  const cardARefs = useRef<HTMLDivElement>(null);
  const cardBRefs = useRef<HTMLDivElement>(null);
  const cardCRefs = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToCard: (cardPosition: 'A' | 'B' | 'C') => {
      const targetRef = cardPosition === 'A' ? cardARefs : 
                       cardPosition === 'B' ? cardBRefs : cardCRefs;
      
      if (targetRef.current) {
        targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
        
        // スクロール後にハイライト効果を追加
        targetRef.current.classList.add('ring-4', 'ring-purple-400', 'ring-opacity-75');
        setTimeout(() => {
          targetRef.current?.classList.remove('ring-4', 'ring-purple-400', 'ring-opacity-75');
        }, 2000);
      }
    }
  }));

  const formatInterpretation = (text: string) => {
    return text.split('。').filter(sentence => sentence.trim()).map((sentence, index) => (
      <span key={index}>
        {sentence.trim()}。
        <br />
      </span>
    ));
  };

  const getCardInterpretation = (card: 'A' | 'B' | 'C') => {
    const cardData = card === 'A' ? reading.cardA : card === 'B' ? reading.cardB : reading.cardC;
    return {
      title: `🔮 ${card}を選んだあなたへ`,
      cardDisplay: `🃏カードの絵柄：${cardData.name}`,
      interpretation: cardData.meaning
    };
  };

  const getAllInterpretationsText = () => {
    const cardA = getCardInterpretation('A');
    const cardB = getCardInterpretation('B');
    const cardC = getCardInterpretation('C');
    
    return `${cardA.title}

${cardA.cardDisplay}

${cardA.interpretation}

━━━━━━━━━━

${cardB.title}

${cardB.cardDisplay}

${cardB.interpretation}

━━━━━━━━━━

${cardC.title}

${cardC.cardDisplay}

${cardC.interpretation}`;
  };

  const getSelectedInterpretationText = (card: 'A' | 'B' | 'C') => {
    const cardData = getCardInterpretation(card);
    
    return `${cardData.title}

${cardData.cardDisplay}

${cardData.interpretation}`;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <h3 className="text-lg md:text-xl font-bold text-purple-800">鑑定結果</h3>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="px-3 sm:px-4 py-2 text-sm font-medium text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRegenerating ? '再生成中...' : '再生成'}
        </button>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* カードA */}
        <div 
          ref={cardARefs}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 md:p-6 border border-purple-200 transition-all duration-500"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="text-center">
              <h4 className="text-xl sm:text-2xl font-bold text-purple-800 mb-2">
                🔮 Aを選んだあなたへ
              </h4>
              <p className="text-base sm:text-lg text-purple-700 mb-2 sm:mb-4">
                🃏カードの絵柄：{reading.cardA.name}
              </p>
              <div className="text-sm">━━━━━━━━━━</div>
            </div>
            
            <div className="bg-white/75 rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-left text-sm sm:text-base">
                {formatInterpretation(reading.cardA.meaning)}
              </div>
            </div>

            <div className="text-center pt-2 sm:pt-4 border-t border-purple-200">
              <CopyButton
                text={getSelectedInterpretationText('A')}
                label="この鑑定をコピー"
                className="mb-2 w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        {/* カードB */}
        <div 
          ref={cardBRefs}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 md:p-6 border border-purple-200 transition-all duration-500"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="text-center">
              <h4 className="text-xl sm:text-2xl font-bold text-purple-800 mb-2">
                🔮 Bを選んだあなたへ
              </h4>
              <p className="text-base sm:text-lg text-purple-700 mb-2 sm:mb-4">
                🃏カードの絵柄：{reading.cardB.name}
              </p>
              <div className="text-sm">━━━━━━━━━━</div>
            </div>
            
            <div className="bg-white/75 rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-left text-sm sm:text-base">
                {formatInterpretation(reading.cardB.meaning)}
              </div>
            </div>

            <div className="text-center pt-2 sm:pt-4 border-t border-purple-200">
              <CopyButton
                text={getSelectedInterpretationText('B')}
                label="この鑑定をコピー"
                className="mb-2 w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        {/* カードC */}
        <div 
          ref={cardCRefs}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 md:p-6 border border-purple-200 transition-all duration-500"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="text-center">
              <h4 className="text-xl sm:text-2xl font-bold text-purple-800 mb-2">
                🔮 Cを選んだあなたへ
              </h4>
              <p className="text-base sm:text-lg text-purple-700 mb-2 sm:mb-4">
                🃏カードの絵柄：{reading.cardC.name}
              </p>
              <div className="text-sm">━━━━━━━━━━</div>
            </div>
            
            <div className="bg-white/75 rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-left text-sm sm:text-base">
                {formatInterpretation(reading.cardC.meaning)}
              </div>
            </div>

            <div className="text-center pt-2 sm:pt-4 border-t border-purple-200">
              <CopyButton
                text={getSelectedInterpretationText('C')}
                label="この鑑定をコピー"
                className="mb-2 w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 sm:pt-4 border-t border-purple-200">
        <CopyButton
          text={getAllInterpretationsText()}
          label="全ての鑑定文をコピー"
          className="w-full"
        />
      </div>
    </div>
  );
}); 