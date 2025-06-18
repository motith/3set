// 大アルカナカードのID型
export type MajorArcanaCardId = 
  | 'fool' | 'magician' | 'high_priestess' | 'empress' | 'emperor'
  | 'hierophant' | 'lovers' | 'chariot' | 'strength' | 'hermit'
  | 'wheel_of_fortune' | 'justice' | 'hanged_man' | 'death' | 'temperance'
  | 'devil' | 'tower' | 'star' | 'moon' | 'sun' | 'judgement' | 'world';

// 占い師のスタンス
export type Stance = 'supportive' | 'realistic' | 'mystical' | 'practical';

// カード選択方法
export type CardSelectionMethod = 'random' | 'manual';

// テーマ入力モード
export type ThemeInputMode = 'select' | 'manual';

// 大アルカナカード情報
export interface MajorArcanaCard {
  id: MajorArcanaCardId;
  name: string;
  nameEn: string;
  keywords: string[];
}

// 手動カード選択の状態
export interface ManualCardSelections {
  CardA: MajorArcanaCardId | '';
  CardB: MajorArcanaCardId | '';
  CardC: MajorArcanaCardId | '';
}

// 選択されたカード情報
export interface SelectedCardInfo {
  position: 'A' | 'B' | 'C';
  cardId: MajorArcanaCardId;
  cardName: string;
}

// 鑑定結果
export interface ReadingOutput {
  cardA: {
    name: string;
    meaning: string;
  };
  cardB: {
    name: string;
    meaning: string;
  };
  cardC: {
    name: string;
    meaning: string;
  };
  overallReading: string;
  timestamp: string;
}

// サブスクリプションプラン
export type SubscriptionPlan = 'free' | 'premium';

// カードセットタイプ
export type CardSetType = 'classic' | 'modern' | 'mystical' | 'romantic';

// ユーザーの使用状況
export interface UserUsage {
  planType: SubscriptionPlan;
  monthlyReadingsUsed: number;
  maxMonthlyReadings: number;
  lastResetDate: string;
  selectedCardSet: CardSetType;
  registrationDate: string;
}

// サブスクリプション設定
export interface SubscriptionSettings {
  free: {
    maxReadings: number;
    features: string[];
  };
  premium: {
    maxReadings: number;
    features: string[];
    cardSets: CardSetType[];
  };
}

// 使用制限チェック結果
export interface UsageCheckResult {
  canUseReading: boolean;
  remainingReadings: number;
  reason?: string;
} 