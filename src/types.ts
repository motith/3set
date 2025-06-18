// 大アルカナカードのID
export type MajorArcanaCardId = 
  | 'fool' | 'magician' | 'high_priestess' | 'empress' | 'emperor'
  | 'hierophant' | 'lovers' | 'chariot' | 'strength' | 'hermit'
  | 'wheel_of_fortune' | 'justice' | 'hanged_man' | 'death' | 'temperance'
  | 'devil' | 'tower' | 'star' | 'moon' | 'sun'
  | 'judgement' | 'world';

// 大アルカナカード情報
export interface MajorArcanaCard {
  id: MajorArcanaCardId;
  name: string;
  nameEn: string;
  keywords: string[];
}

// 占い師のスタンス
export type Stance = 'supportive' | 'realistic' | 'mystical' | 'practical';

// カード選択方法
export type CardSelectionMethod = 'random' | 'manual';

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

// 鑑定結果の出力
export interface ReadingOutput {
  cardA: {
    cardName: string;
    interpretation: string;
  };
  cardB: {
    cardName: string;
    interpretation: string;
  };
  cardC: {
    cardName: string;
    interpretation: string;
  };
}

// テーマ入力モード
export type ThemeInputMode = 'select' | 'text' | null; 