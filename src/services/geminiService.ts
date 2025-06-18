import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReadingOutput, SelectedCardInfo, Stance } from '../types';

// Gemini APIの初期化
let genAI: GoogleGenerativeAI | null = null;

export const initializeGeminiAPI = (apiKey: string): boolean => {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    return true;
  } catch (error) {
    console.error('Gemini API初期化エラー:', error);
    return false;
  }
};

export const isGeminiAvailable = (): boolean => {
  return genAI !== null;
};

// プロンプトテンプレートの構築
const buildPrompt = (
  fortuneTheme: string,
  stance: Stance,
  selectedCards: SelectedCardInfo[]
): string => {
  const stanceDescriptions = {
    supportive: {
      description: '相談者に寄り添い、優しく共感する',
      tone: '温かく包み込むような優しい語調で、相談者の気持ちに寄り添い、希望と安心感を与える',
      keywords: '優しく、温かく、安心して、心配ありません、大丈夫、きっと、愛情深く、包み込む',
      approach: '相談者の不安を和らげ、ポジティブな未来への希望を強調'
    },
    realistic: {
      description: '現実的で率直なアドバイス',
      tone: '冷静で客観的、建設的な語調で、具体的な状況分析と実践的なアドバイスを提供',
      keywords: '現実的に、客観的に、具体的に、効果的に、計画的に、着実に、確実に、実際に',
      approach: '感情論ではなく現実的な分析に基づいた、実現可能な道筋を示す'
    },
    mystical: {
      description: 'スピリチュアルで神秘的な視点',
      tone: '神秘的で深遠な語調で、宇宙の法則や運命的な要素を取り入れた表現',
      keywords: '運命的に、宇宙が、エネルギーが、魂の、スピリチュアルに、神秘的に、導かれて',
      approach: '目に見えない力や宇宙の意志による恋愛成就を示唆'
    },
    practical: {
      description: '具体的で実践的な解決策',
      tone: 'すぐに行動に移せる具体的で実用的な語調で、明確なステップを提示',
      keywords: '具体的に、実践的に、すぐに、方法として、ステップとして、効率的に、継続的に',
      approach: '今すぐ実行できる具体的な行動指針と実践方法を明示'
    }
  };

  const cardInfo = selectedCards.map(card => 
    `${card.position}: ${card.cardName}`
  ).join(', ');

  const currentStance = stanceDescriptions[stance];

  return `あなたは経験豊富な恋愛タロット占い師です。以下の相談に対して、300文字程度の詳細で具体的な鑑定文を作成してください。

【相談内容】${fortuneTheme}
【占い師スタンス】${currentStance.description}
【語調・表現方針】${currentStance.tone}
【使用キーワード】${currentStance.keywords}
【アプローチ方法】${currentStance.approach}
【選択されたカード】${cardInfo}

【必須要件】
1. **冒頭で明確な回答**：1行目で相談内容に対するポジティブで明確な結論を述べる
2. **文字数**：各カードの鑑定文は必ず280-320文字で構成
3. **恋愛キーワード多用**：愛情、恋心、気持ち、想い、絆、関係、魅力、運命、出会い、相手、心、幸せ、未来、成就、発展など
4. **改行ルール**：句点（。）の後は必ず改行
5. **語尾バリエーション**：です・ます調で、同じ語尾の連続を避ける
6. **スタンス反映**：上記の【語調・表現方針】【使用キーワード】【アプローチ方法】を必ず鑑定文に取り入れる

【絶対禁止事項】
- あいさつ文（こんにちは、お疲れ様など）
- 前置き文（あなたの疑問に対する答えは、鑑定結果をお伝えします など）
- 判断丸投げ（あなた次第です、あなたが決めること など）
- 壮大表現（宇宙の力、無限の愛 など）
- 感嘆符（！）の使用
- 抽象的な表現のみの文章

【文章構造（300文字構成例）】
- 1行目（30文字）：相談への明確でポジティブな回答
- 2-3行目（80文字）：カードが示す具体的な恋愛状況
- 4-6行目（120文字）：相手の気持ちや関係の発展について
- 7-8行目（70文字）：今後の展開と安心できる締めくくり

【参考文例】
"その恋は順調に進展しています。
相手はあなたに対して好意的な感情を抱いており、心の距離が縮まっています。
日頃のやり取りの中で、あなたの魅力が確実に伝わっているのです。
相手もあなたとの時間を大切に思い、特別な存在として認識し始めています。
お互いの気持ちが通じ合うタイミングが近づいており、関係が一歩前進するでしょう。
自然体でいることで、愛情がより深く育まれていきます。"

JSON形式で回答してください：
{
  "cardA": {
    "name": "${selectedCards[0].cardName}",
    "meaning": "上記ルールに従った300文字程度の鑑定文"
  },
  "cardB": {
    "name": "${selectedCards[1].cardName}",
    "meaning": "上記ルールに従った300文字程度の鑑定文"
  },
  "cardC": {
    "name": "${selectedCards[2].cardName}",
    "meaning": "上記ルールに従った300文字程度の鑑定文"
  },
  "overallReading": "全体的な鑑定の要約",
  "timestamp": "${new Date().toISOString()}"
}`;
};

// 鑑定文生成
export const generateReading = async (
  fortuneTheme: string,
  stance: Stance,
  selectedCards: SelectedCardInfo[]
): Promise<ReadingOutput> => {
  if (!genAI) {
    throw new Error('Gemini APIが初期化されていません');
  }

  try {
    console.log('=== Gemini API呼び出し開始 ===');
    console.log('テーマ:', fortuneTheme);
    console.log('スタンス:', stance);
    console.log('カード:', selectedCards);

    // gemini-1.5-flashモデルを使用
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = buildPrompt(fortuneTheme, stance, selectedCards);
    
    console.log('プロンプト長:', prompt.length);
    console.log('プロンプト preview:', prompt.substring(0, 200) + '...');
    
    const result = await model.generateContent(prompt);
    console.log('API応答受信');
    
    const response = await result.response;
    const text = response.text();
    
    console.log('応答テキスト:', text);
    console.log('応答テキスト長:', text.length);
    
    // JSON文字列をクリーンアップ
    let cleanText = text.trim();
    
    // マークダウンのコードブロックを削除
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    console.log('クリーンアップ後:', cleanText);
    
    // JSONパース
    const readingOutput: ReadingOutput = JSON.parse(cleanText);
    
    // バリデーション
    if (!readingOutput.cardA || !readingOutput.cardB || !readingOutput.cardC) {
      console.error('バリデーションエラー:', readingOutput);
      throw new Error('鑑定結果の形式が正しくありません');
    }
    
    console.log('=== 成功 ===');
    return readingOutput;
  } catch (error) {
    console.error('=== Gemini APIエラー詳細 ===');
    console.error('エラー:', error);
    console.error('エラータイプ:', typeof error);
    console.error('エラーメッセージ:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof SyntaxError) {
      console.error('JSON解析エラー');
      throw new Error('鑑定結果の解析に失敗しました。もう一度お試しください。');
    }
    if (error instanceof Error && error.message.includes('API')) {
      console.error('APIエラー');
      throw new Error('APIキーが無効です。設定を確認してください。');
    }
    if (error instanceof Error && error.message.includes('quota')) {
      console.error('クォータエラー');
      throw new Error('API使用量の上限に達しました。しばらく待ってから再試行してください。');
    }
    
    console.error('その他のエラー');
    throw new Error('鑑定文の生成に失敗しました。もう一度お試しください。');
  }
}; 