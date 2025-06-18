import { MajorArcanaCard, Stance } from './types';

// 大アルカナカードリスト
export const MAJOR_ARCANA_CARDS: MajorArcanaCard[] = [
  { id: 'fool', name: '愚者', nameEn: 'The Fool', keywords: ['新しい始まり', '純粋', '冒険', '無邪気'] },
  { id: 'magician', name: '魔術師', nameEn: 'The Magician', keywords: ['創造力', '意志', 'スキル', '機会'] },
  { id: 'high_priestess', name: '女教皇', nameEn: 'The High Priestess', keywords: ['直感', '神秘', '内なる知恵', '秘密'] },
  { id: 'empress', name: '女帝', nameEn: 'The Empress', keywords: ['豊かさ', '母性', '創造', '自然'] },
  { id: 'emperor', name: '皇帝', nameEn: 'The Emperor', keywords: ['権威', 'リーダーシップ', '安定', '父親'] },
  { id: 'hierophant', name: '教皇', nameEn: 'The Hierophant', keywords: ['伝統', '教育', '精神性', 'ガイダンス'] },
  { id: 'lovers', name: '恋人', nameEn: 'The Lovers', keywords: ['愛', '選択', '調和', '関係'] },
  { id: 'chariot', name: '戦車', nameEn: 'The Chariot', keywords: ['勝利', '意志', '決断', '進歩'] },
  { id: 'strength', name: '力', nameEn: 'Strength', keywords: ['勇気', '忍耐', '内なる力', '優しさ'] },
  { id: 'hermit', name: '隠者', nameEn: 'The Hermit', keywords: ['内省', '孤独', '知恵', 'ガイダンス'] },
  { id: 'wheel_of_fortune', name: '運命の輪', nameEn: 'Wheel of Fortune', keywords: ['変化', '運命', 'サイクル', '転機'] },
  { id: 'justice', name: '正義', nameEn: 'Justice', keywords: ['公平', '真実', 'バランス', '責任'] },
  { id: 'hanged_man', name: '吊るされた男', nameEn: 'The Hanged Man', keywords: ['犠牲', '新しい視点', '待機', '解放'] },
  { id: 'death', name: '死神', nameEn: 'Death', keywords: ['終わり', '変化', '変容', '新しい始まり'] },
  { id: 'temperance', name: '節制', nameEn: 'Temperance', keywords: ['バランス', '調和', '忍耐', '癒し'] },
  { id: 'devil', name: '悪魔', nameEn: 'The Devil', keywords: ['束縛', '欲望', '物質主義', '解放'] },
  { id: 'tower', name: '塔', nameEn: 'The Tower', keywords: ['突然の変化', '崩壊', '啓示', '解放'] },
  { id: 'star', name: '星', nameEn: 'The Star', keywords: ['希望', '癒し', 'インスピレーション', '信仰'] },
  { id: 'moon', name: '月', nameEn: 'The Moon', keywords: ['直感', '幻想', '不安', '無意識'] },
  { id: 'sun', name: '太陽', nameEn: 'The Sun', keywords: ['喜び', '成功', '活力', '真実'] },
  { id: 'judgement', name: '審判', nameEn: 'Judgement', keywords: ['復活', '覚醒', '救済', '新しい使命'] },
  { id: 'world', name: '世界', nameEn: 'The World', keywords: ['完成', '達成', '調和', '旅の終わり'] }
];

// 占い師スタンス選択肢
export const STANCES_OPTIONS: { value: Stance; label: string; description: string }[] = [
  { 
    value: 'supportive', 
    label: '寄り添い・共感', 
    description: '相談者の気持ちに寄り添い、優しく導くスタイル' 
  },
  { 
    value: 'realistic', 
    label: '辛口・現実的', 
    description: '現実を直視し、厳しい真実も伝えるスタイル' 
  },
  { 
    value: 'mystical', 
    label: '神秘的・スピリチュアル', 
    description: '宇宙のエネルギーや運命の流れを重視するスタイル' 
  },
  { 
    value: 'practical', 
    label: '実践的・アドバイス重視', 
    description: '具体的な行動指針や解決策を提示するスタイル' 
  }
];

// 占いテーマ提案
export const FORTUNE_THEME_SUGGESTIONS = [
  '好きな人から告白される可能性は？',
  'あの人が隠してるあなたへの本音',
  'これから二人の関係どうなる？',
  '今、この瞬間の好きな人の気持ちは？',
  '大好きなあの人と結ばれる日は来る？',
  'あの人の心の中に私はいるの？',
  'あの人は恋愛対象として見てる？',
  'もうすぐ現実になる恋の行方',
  '今のあの人の素直な気持ちは？',
  'あの人はあなたに何を隠してる？',
  'あの人からの緊急メッセージ',
  'あなたの恋愛これからどう進む？',
  'あの人はこの関係に何を思ってる？',
  'あのひとのリアルな本音',
  '大好きな人はあなたの連絡を待ってる？',
  '好きな人はあなたに恋心を抱いている？',
  'あの人にとって今のあなたの存在は？',
  'あなたの恋まもなくハッキリすること',
  '大好きなあの人のあなたへの本気度は？',
  '彼はあなたに会いたいと思ってる？',
  'あなたに言えないあの人の気持ちは？',
  'この関係あの人はどうしたい？',
  '好きな人には好きな人がいる？',
  '実はあなたにべた惚れしてる人',
  'あなたに本気で告白を考えている人',
  'あなたが次に付き合う人の特徴',
  '1年後にあなたの隣にいる人'
];

// カード選択方法のラベル
export const CARD_SELECTION_LABELS = {
  random: 'ランダム選択',
  manual: '手動選択'
}; 