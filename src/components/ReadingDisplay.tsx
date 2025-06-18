import React from 'react';
import { ReadingOutput } from '../types';
import { CopyButton } from './CopyButton';

interface ReadingDisplayProps {
  reading: ReadingOutput;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const ReadingDisplay: React.FC<ReadingDisplayProps> = ({
  reading,
  onRegenerate,
  isRegenerating
}) => {
  const formatInterpretation = (text: string) => {
    return text.split('。').filter(sentence => sentence.trim()).map((sentence, index) => (
      <span key={index}>
        {sentence.trim()}。
        <br />
      </span>
    ));
  };

  const getCardInterpretation = (card: 'A' | 'B' | 'C') => {
    const cardData = reading[`card${card}`];
    return {
      title: `🔮 ${card}を選んだあなたへ`,
      cardDisplay: `🃏カードの絵柄：${cardData.cardName}`,
      interpretation: cardData.interpretation
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-purple-800">鑑定結果</h3>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="px-4 py-2 text-sm font-medium text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRegenerating ? '再生成中...' : '再生成'}
        </button>
      </div>

      <div className="space-y-6">
        {/* カードA */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-purple-800 mb-2">
                🔮 Aを選んだあなたへ
              </h4>
              <p className="text-lg text-purple-700 mb-4">
                🃏カードの絵柄：{reading.cardA.cardName}
              </p>
              <div className="text-sm">━━━━━━━━━━</div>
            </div>
            
            <div className="bg-white/75 rounded-lg p-6 shadow-sm">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-left">
                {formatInterpretation(reading.cardA.interpretation)}
              </div>
            </div>

            <div className="text-center pt-4 border-t border-purple-200">
              <CopyButton
                text={getSelectedInterpretationText('A')}
                label="この鑑定をコピー"
                className="mb-2"
              />
            </div>
          </div>
        </div>

        {/* カードB */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-purple-800 mb-2">
                🔮 Bを選んだあなたへ
              </h4>
              <p className="text-lg text-purple-700 mb-4">
                🃏カードの絵柄：{reading.cardB.cardName}
              </p>
              <div className="text-sm">━━━━━━━━━━</div>
            </div>
            
            <div className="bg-white/75 rounded-lg p-6 shadow-sm">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-left">
                {formatInterpretation(reading.cardB.interpretation)}
              </div>
            </div>

            <div className="text-center pt-4 border-t border-purple-200">
              <CopyButton
                text={getSelectedInterpretationText('B')}
                label="この鑑定をコピー"
                className="mb-2"
              />
            </div>
          </div>
        </div>

        {/* カードC */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-purple-800 mb-2">
                🔮 Cを選んだあなたへ
              </h4>
              <p className="text-lg text-purple-700 mb-4">
                🃏カードの絵柄：{reading.cardC.cardName}
              </p>
              <div className="text-sm">━━━━━━━━━━</div>
            </div>
            
            <div className="bg-white/75 rounded-lg p-6 shadow-sm">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-left">
                {formatInterpretation(reading.cardC.interpretation)}
              </div>
            </div>

            <div className="text-center pt-4 border-t border-purple-200">
              <CopyButton
                text={getSelectedInterpretationText('C')}
                label="この鑑定をコピー"
                className="mb-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-purple-200">
        <CopyButton
          text={getAllInterpretationsText()}
          label="全ての鑑定文をコピー"
          className="w-full"
        />
      </div>
    </div>
  );
}; 