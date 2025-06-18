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
    supportive: '相談者に寄り添い、優しく共感する',
    realistic: '現実的で率直なアドバイス',
    mystical: 'スピリチュアルで神秘的な視点',
    practical: '具体的で実践的な解決策'
  };

  const cardInfo = selectedCards.map(card => 
    `${card.position}: ${card.cardName}`
  ).join(', ');

  return `恋愛タロット占い師として、以下の相談に対して明確な鑑定結果を提供してください。

【相談内容】${fortuneTheme}
【占い師スタンス】${stanceDescriptions[stance]}
【選択されたカード】${cardInfo}

【重要な鑑定ルール】
1. 冒頭で相談内容に対する明確でポジティブな回答を必ず記載する
2. 各鑑定文は300文字程度で構成する
3. 恋愛関連キーワード（愛、恋心、気持ち、想い、絆、関係、魅力、運命など）を積極的に使用する
4. 句点ごとに必ず改行する
5. 相談者を安心させるポジティブな表現で締めくくる

【絶対に守る禁止事項】
- あいさつや前置きは一切書かない
- 「あなたの疑問に対する答えは」等の導入文は禁止
- 「あなた次第です」など相談者に判断を委ねる表現は禁止
- 壮大な言い回しや抽象的な表現は避ける
- 感嘆符（！）は使用しない
- 同じ語尾の連続使用は避ける

【文章構成】
1行目：相談内容への直接的でポジティブな回答
2行目以降：カードの意味と相談内容を関連付けた具体的な鑑定
最終行：安心感を与えるポジティブな締めくくり

JSON形式で回答してください：
{
  "cardA": {
    "cardName": "${selectedCards[0].cardName}",
    "interpretation": "上記ルールに従った300文字程度の鑑定文"
  },
  "cardB": {
    "cardName": "${selectedCards[1].cardName}",
    "interpretation": "上記ルールに従った300文字程度の鑑定文"
  },
  "cardC": {
    "cardName": "${selectedCards[2].cardName}",
    "interpretation": "上記ルールに従った300文字程度の鑑定文"
  }
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