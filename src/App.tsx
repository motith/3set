import { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { StanceSelector } from './components/StanceSelector';
import { CardSelector } from './components/CardSelector';
import { ManualCardInput } from './components/ManualCardInput';
import { ReadingDisplay } from './components/ReadingDisplay';
import { MAJOR_ARCANA_CARDS, FORTUNE_THEME_SUGGESTIONS } from './constants';
import { generateReading, initializeGeminiAPI, isGeminiAvailable } from './services/geminiService';
import type { 
  Stance, 
  CardSelectionMethod, 
  ManualCardSelections, 
  SelectedCardInfo, 
  ReadingOutput,
  MajorArcanaCardId,
  ThemeInputMode
} from './types';

function App() {
  // 状態管理
  const [fortuneTheme, setFortuneTheme] = useState('');
  const [themeInputMode, setThemeInputMode] = useState<ThemeInputMode>('select');
  const [selectedStance, setSelectedStance] = useState<Stance>('supportive');
  const [cardSelectionMethod, setCardSelectionMethod] = useState<CardSelectionMethod>('random');
  const [manualCardSelections, setManualCardSelections] = useState<ManualCardSelections>({
    CardA: '',
    CardB: '',
    CardC: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [generatedReading, setGeneratedReading] = useState<ReadingOutput | null>(null);
  const [cardsUsedInReading, setCardsUsedInReading] = useState<SelectedCardInfo[]>([]);

  // APIキーの初期化
  useEffect(() => {
    // APIキーが正常確認されたため、初期化を有効化
    const apiKey = 'AIzaSyC7aZdqlIF7zwIQvfss7STUebsKj0qpMU4';
    if (!apiKey) {
      setApiKeyError('APIキーが設定されていません。');
      return;
    }
    
    const success = initializeGeminiAPI(apiKey);
    if (!success) {
      setApiKeyError('APIキーの初期化に失敗しました。');
    }
  }, []);

  // ランダムカード選択
  const getRandomCards = (): SelectedCardInfo[] => {
    const shuffled = [...MAJOR_ARCANA_CARDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((card, index) => ({
      position: ['A', 'B', 'C'][index] as 'A' | 'B' | 'C',
      cardId: card.id,
      cardName: card.name
    }));
  };

  // 手動カード選択の検証
  const validateManualCardSelection = (): boolean => {
    const selections = Object.values(manualCardSelections);
    return selections.every(card => card !== '') && 
           new Set(selections).size === 3;
  };

  // カード選択の取得
  const getCardsForGeneration = (): SelectedCardInfo[] => {
    if (cardSelectionMethod === 'random') {
      return getRandomCards();
    } else {
      if (!validateManualCardSelection()) {
        throw new Error('3枚の異なるカードを選択してください。');
      }
      return [
        { position: 'A', cardId: manualCardSelections.CardA as MajorArcanaCardId, cardName: MAJOR_ARCANA_CARDS.find(c => c.id === manualCardSelections.CardA)?.name || '' },
        { position: 'B', cardId: manualCardSelections.CardB as MajorArcanaCardId, cardName: MAJOR_ARCANA_CARDS.find(c => c.id === manualCardSelections.CardB)?.name || '' },
        { position: 'C', cardId: manualCardSelections.CardC as MajorArcanaCardId, cardName: MAJOR_ARCANA_CARDS.find(c => c.id === manualCardSelections.CardC)?.name || '' }
      ];
    }
  };

  // デモ用鑑定文のパターン生成（スタンス反映版）
  const generateDemoReading = (cards: SelectedCardInfo[], _theme: string, stance: Stance): ReadingOutput => {
    
    // カードごとの基本意味
    const cardMeanings: Record<string, string[]> = {
      'fool': ['新しい始まり', '純粋な愛', '冒険心', '自由な恋'],
      'magician': ['積極的行動', '魅力的な自分', '意志の力', '恋の実現力'],
      'high-priestess': ['直感力', '神秘的魅力', '内なる美しさ', '深い絆'],
      'empress': ['豊かな愛', '母性的魅力', '包容力', '愛の成熟'],
      'emperor': ['安定した関係', 'リーダーシップ', '頼れる存在', '責任ある愛'],
      'hierophant': ['伝統的な愛', '真面目な交際', '結婚への道', '信頼関係'],
      'lovers': ['運命の出会い', '選択の時', '深い愛情', '相互理解'],
      'chariot': ['恋の勝利', '情熱的な愛', '積極性', '目標達成'],
      'strength': ['内なる強さ', '優しい力', '忍耐強い愛', '心の絆'],
      'hermit': ['自分を見つめ直す', '成熟した愛', '深い理解', '精神的つながり'],
      'wheel-of-fortune': ['運命の転換', '幸運の到来', '恋愛運上昇', '新たなチャンス'],
      'justice': ['公平な関係', 'バランスの取れた愛', '誠実さ', '正しい判断'],
      'hanged-man': ['新しい視点', '待つことの大切さ', '内面の成長', '愛の犠牲'],
      'death': ['変化と再生', '新しい恋の始まり', '関係の変革', '愛の深化'],
      'temperance': ['調和とバランス', '穏やかな愛', '癒しの関係', '心の平和'],
      'devil': ['情熱的な愛', '束縛からの解放', '本能的魅力', '誘惑と選択'],
      'tower': ['劇的な変化', '突然の展開', '既存関係の見直し', '新たな可能性'],
      'star': ['希望と癒し', '理想の愛', '精神的つながり', '夢の実現'],
      'moon': ['不安と迷い', '隠された感情', '直感を信じる', '神秘的な愛'],
      'sun': ['明るい未来', '純粋な喜び', '成功する恋', '幸福な関係'],
      'judgement': ['復活と再生', '新しいステージ', '過去からの学び', '愛の覚醒'],
      'world': ['完成と達成', '理想的な愛', '全てが整う', '永遠の絆']
    };

    // スタンス別の語調とアプローチ
    const stanceStyles = {
      supportive: {
        prefix: ['そうですね、', 'お気持ちよくわかります。', 'その想い、とても素敵です。'],
        tone: ['優しく', '温かく', '包み込むように'],
        ending: ['きっと大丈夫です。', 'あなたらしく進んでください。', '心配しなくても、愛は実りますよ。']
      },
      realistic: {
        prefix: ['率直に申し上げますと、', '現実的に考えて、', 'はっきりお伝えします。'],
        tone: ['具体的に', '冷静に', '客観的に'],
        ending: ['行動が必要です。', '努力次第で変わります。', '現実と向き合いましょう。']
      },
      mystical: {
        prefix: ['星々が告げています。', '宇宙のエネルギーが示すのは、', '運命の糸が織りなすのは、'],
        tone: ['神秘的に', 'スピリチュアルに', '宇宙的視点で'],
        ending: ['魂の導きに従って。', '宇宙があなたを応援しています。', '運命を信じてください。']
      },
      practical: {
        prefix: ['具体的な対策として、', '実践的なアドバイスです。', 'おすすめの行動は、'],
        tone: ['実用的に', '段階的に', '効果的に'],
        ending: ['今すぐ実行してみてください。', 'この方法で必ず変化が生まれます。', '継続が成功の鍵です。']
      }
    };

    const generateCardReading = (card: SelectedCardInfo, _position: string): string => {
      const meanings = cardMeanings[card.cardId] || ['愛の可能性', '恋の発展', '心の成長', '関係の深化'];
      const selectedMeaning = meanings[Math.floor(Math.random() * meanings.length)];
      const style = stanceStyles[stance];
      
      const prefix = style.prefix[Math.floor(Math.random() * style.prefix.length)];
      const ending = style.ending[Math.floor(Math.random() * style.ending.length)];
      
      const baseTexts = {
        supportive: [
          `${prefix}${card.cardName}が示すのは「${selectedMeaning}」です。
あなたの恋愛には素晴らしい可能性が秘められています。
相手もあなたの魅力を感じ取っており、心の距離が縮まっています。
愛情に対する純粋な気持ちが、二人の関係をより深いものにしているのです。
今は愛の種が芽吹く時期で、お互いを思いやる気持ちが育っています。
自然体でいることで、相手との信頼関係が強くなっていくでしょう。
${ending}`,
          
          `${prefix}${card.cardName}からのメッセージは「${selectedMeaning}」です。
あなたの恋心は確実に相手に伝わっており、良い反応を得ています。
恋愛において大切な心の通じ合いが生まれつつあります。
相手はあなたといる時間を特別なものと感じ、心を開いてくれています。
愛に対する前向きな姿勢が、幸運な展開を引き寄せているのです。
素直な気持ちを大切にすることで、愛はより美しく花開きます。
${ending}`
        ],
        
        realistic: [
          `${prefix}${card.cardName}は「${selectedMeaning}」を表しています。
現在の状況を冷静に分析すると、恋愛に進展の兆しが見えます。
相手からの好意的なサインを見逃さずに、適切にアプローチすることが重要です。
感情だけでなく、相手の立場や気持ちを考慮した行動が必要でしょう。
恋愛成功のためには、計画的で一貫した態度を保つことが効果的です。
タイミングを見極めて、誠実に気持ちを伝えていくべきです。
${ending}`,
          
          `${prefix}${card.cardName}が告げるのは「${selectedMeaning}」という現実です。
恋愛を成功させるには、まず自分自身を客観視することが大切です。
相手との関係性を正しく把握し、現実的な歩み寄りが求められています。
理想だけでなく、お互いの価値観や生活スタイルの調和も考慮しましょう。
継続的なコミュニケーションと相互理解が、関係発展の基盤となります。
地道な努力を積み重ねることで、確実な結果を得ることができます。
${ending}`
        ],
        
        mystical: [
          `${prefix}${card.cardName}のスピリチュアルエネルギーは「${selectedMeaning}」を放っています。
宇宙のパワーがあなたの恋愛運を高次元へと導いているのです。
魂レベルでの深いつながりが、二人の間に神秘的な絆を築いています。
前世からの因縁が今世で花開き、運命的な出会いが現実化しています。
チャクラの調和により、愛のエネルギーが純粋に流れ始めました。
高次元の存在たちがあなたの恋愛を守護し、最良の道へと導いています。
${ending}`,
          
          `${prefix}${card.cardName}から流れるコズミックエネルギーが「${selectedMeaning}」を示現しています。
アカシックレコードに刻まれた愛の記憶が蘇り、魂の伴侶との再会が近づいています。
天使たちのガイダンスにより、恋愛における障壁が取り除かれつつあります。
オーラの輝きが増し、異性を惹きつける磁力が強化されています。
宇宙の法則に従い、愛の波動が正しい方向へと共鳴しているのです。
スピリットガイドからのメッセージを受け取り、直感に従って行動してください。
${ending}`
        ],
        
        practical: [
          `${prefix}${card.cardName}が示す「${selectedMeaning}」を活用する方法をお教えします。
まずは相手との接触頻度を週2-3回程度に増やしてみてください。
共通の趣味や興味を見つけて、自然な会話のきっかけを作りましょう。
LINEやメッセージは、相手の生活リズムに合わせて送ることが重要です。
デートの提案は具体的な日時と場所を示し、相手が答えやすくしてください。
外見だけでなく、内面的な魅力を高める自分磨きも並行して行いましょう。
${ending}`,
          
          `${prefix}${card.cardName}の「${selectedMeaning}」エネルギーを実践に移す具体策があります。
相手の誕生日や記念日を覚えて、さりげない気遣いを示してください。
会話では聞き役に回り、相手の話に真摯に耳を傾けることが大切です。
小さなプレゼントや手作りのものを通じて、あなたの気持ちを表現しましょう。
グループでの活動に参加し、自然な形で距離を縮める機会を増やしてください。
恋愛以外の分野でも自分を成長させ、魅力的な人間になることを心がけましょう。
${ending}`
        ]
      };
      
      const stanceTexts = baseTexts[stance];
      return stanceTexts[Math.floor(Math.random() * stanceTexts.length)];
    };

    return {
      cardA: { 
        cardName: cards[0].cardName, 
        interpretation: generateCardReading(cards[0], 'A')
      },
      cardB: { 
        cardName: cards[1].cardName, 
        interpretation: generateCardReading(cards[1], 'B')
      },
      cardC: { 
        cardName: cards[2].cardName, 
        interpretation: generateCardReading(cards[2], 'C')
      }
    };
  };

  // 鑑定文生成（Gemini API使用）
  const handleGenerateReading = async () => {
    setError(null);
    
    // バリデーション
    if (!fortuneTheme.trim()) {
      setError('占いテーマを入力してください。');
      return;
    }
    
    if (fortuneTheme.length > 50) {
      setError('占いテーマは50文字以内で入力してください。');
      return;
    }

    try {
      setIsLoading(true);
      const selectedCards = getCardsForGeneration();
      
      // 実際のGemini APIを使用して鑑定文生成
      if (isGeminiAvailable()) {
        console.log('🤖 Gemini AI APIを使用して鑑定文を生成しています...');
        const aiReading = await generateReading(fortuneTheme, selectedStance, selectedCards);
        setGeneratedReading(aiReading);
        console.log('✅ Gemini AI APIによる鑑定文生成完了');
      } else {
        // APIが利用できない場合はデモ版を使用
        console.log('⚠️ Gemini APIが利用できないため、デモモードを使用します');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const demoReading = generateDemoReading(selectedCards, fortuneTheme, selectedStance);
        setGeneratedReading(demoReading);
        setError('現在デモモードで動作しています。');
      }
      
      setCardsUsedInReading(selectedCards);
    } catch (err) {
      console.error('鑑定文生成エラー:', err);
      // エラー時はデモモードにフォールバック
      try {
        console.log('🔄 エラーのため、デモモードにフォールバック中...');
        const demoReading = generateDemoReading(getCardsForGeneration(), fortuneTheme, selectedStance);
        setGeneratedReading(demoReading);
        setCardsUsedInReading(getCardsForGeneration());
        setError('AI鑑定でエラーが発生しました。デモ版の鑑定文を表示しています。');
      } catch (fallbackErr) {
        setError('鑑定文の生成に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 再生成
  const handleRegenerateReading = async () => {
    if (!cardsUsedInReading.length) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      // 実際のGemini APIを使用して再生成
      if (isGeminiAvailable()) {
        const aiReading = await generateReading(fortuneTheme, selectedStance, cardsUsedInReading);
        setGeneratedReading(aiReading);
      } else {
        // APIが利用できない場合はデモ版を使用
        await new Promise(resolve => setTimeout(resolve, 1500));
        const demoReading = generateDemoReading(cardsUsedInReading, fortuneTheme, selectedStance);
        setGeneratedReading(demoReading);
      }
    } catch (err) {
      console.error('鑑定文再生成エラー:', err);
      // エラー時はデモモードにフォールバック
      try {
        const demoReading = generateDemoReading(cardsUsedInReading, fortuneTheme, selectedStance);
        setGeneratedReading(demoReading);
        setError('AI鑑定でエラーが発生しました。デモ版の鑑定文を表示しています。');
      } catch (fallbackErr) {
        setError('鑑定文の再生成に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // テーマ入力の切り替え
  const handleThemeModeChange = (mode: ThemeInputMode) => {
    setThemeInputMode(mode);
    setFortuneTheme('');
  };

  // APIキーエラーがある場合は専用メッセージを表示
  if (apiKeyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white/75 backdrop-blur-md rounded-xl p-8 shadow-lg border border-purple-100 max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-800">APIキーエラー</h2>
            <p className="text-red-700">{apiKeyError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <SparklesIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">タロット鑑定支援アプリ</h1>
            <SparklesIcon className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-purple-700">AIを活用した恋愛テーマ特化型タロット鑑定ツール</p>
          <div className="mt-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg inline-block">
            <p className="text-green-700 text-sm">✨ Gemini AI搭載：本格的なAI鑑定をお楽しみください</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 入力セクション */}
          <div className="bg-white/75 backdrop-blur-md rounded-xl p-6 shadow-lg border border-purple-100">
            <h2 className="text-xl font-bold text-purple-800 mb-6">鑑定設定</h2>
            
            {/* 占いテーマ入力 - タブ形式 */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-purple-700">
                占いテーマ
              </label>
              
              {/* タブヘッダー */}
              <div className="flex space-x-1 bg-purple-100 rounded-lg p-1">
                <button
                  onClick={() => handleThemeModeChange('select')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    themeInputMode === 'select'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  既存テーマから選択
                </button>
                <button
                  onClick={() => handleThemeModeChange('text')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    themeInputMode === 'text'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  テーマを入力
                </button>
              </div>

              {/* タブコンテンツ */}
              {themeInputMode === 'select' && (
                <div>
                  <select
                    value={fortuneTheme}
                    onChange={(e) => setFortuneTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/75 backdrop-blur-sm"
                  >
                    <option value="">テーマを選択してください</option>
                    {FORTUNE_THEME_SUGGESTIONS.map((theme, index) => (
                      <option key={index} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              )}

              {themeInputMode === 'text' && (
                <div className="space-y-2">
                  <textarea
                    value={fortuneTheme}
                    onChange={(e) => setFortuneTheme(e.target.value)}
                    placeholder="恋愛に関する相談内容を入力してください（50文字以内）"
                    maxLength={50}
                    rows={3}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/75 backdrop-blur-sm resize-none"
                  />
                  <div className="text-right">
                    <span className="text-xs text-purple-600">
                      {fortuneTheme.length}/50文字
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 占い師スタンス選択 */}
            <div className="mb-6">
              <StanceSelector
                selectedStance={selectedStance}
                onStanceChange={setSelectedStance}
                disabled={isLoading}
              />
            </div>

            {/* カード選択方法 */}
            <div className="mb-6">
              <CardSelector
                cardSelectionMethod={cardSelectionMethod}
                onMethodChange={setCardSelectionMethod}
                disabled={isLoading}
              />
            </div>

            {/* 手動カード選択 */}
            {cardSelectionMethod === 'manual' && (
              <div className="mb-6">
                <ManualCardInput
                  manualCardSelections={manualCardSelections}
                  onCardSelectionChange={setManualCardSelections}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* 生成ボタン */}
            <button
              onClick={handleGenerateReading}
              disabled={isLoading || !fortuneTheme.trim() || fortuneTheme.length > 50 || (cardSelectionMethod === 'manual' && !validateManualCardSelection())}
              className="w-full py-3 px-6 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>鑑定中...</span>
                </div>
              ) : (
                '✨ 鑑定文を生成'
              )}
            </button>

            {/* エラー表示 */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* 出力セクション */}
          <div className="bg-white/75 backdrop-blur-md rounded-xl p-6 shadow-lg border border-purple-100">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-purple-700 mb-2">
                  鑑定中...
                </h3>
                <p className="text-purple-600 text-sm">
                  AIが鑑定文を生成しています
                </p>
              </div>
            ) : generatedReading ? (
              <ReadingDisplay
                reading={generatedReading}
                onRegenerate={handleRegenerateReading}
                isRegenerating={isLoading}
              />
            ) : (
              <div className="text-center py-12">
                <SparklesIcon className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-purple-700 mb-2">
                  鑑定結果がここに表示されます
                </h3>
                <p className="text-purple-600 text-sm">
                  左側の設定を完了して「鑑定文を生成」ボタンを押してください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 