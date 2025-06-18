import type { 
  UserUsage, 
  CardSetType, 
  UsageCheckResult,
  SubscriptionSettings 
} from '../types';

// サブスクリプション設定
const SUBSCRIPTION_SETTINGS: SubscriptionSettings = {
  free: {
    maxReadings: 5,
    features: [
      'クラシックタロットカード',
      '基本的な3枚スプレッド',
      '既存テーマから選択',
      '月5回まで鑑定'
    ]
  },
  premium: {
    maxReadings: 50,
    features: [
      '全タロットカードセット選択可能',
      '高品質AI鑑定',
      '自由テーマ入力',
      '月50回まで鑑定',
      '詳細な解釈',
      '優先サポート'
    ],
    cardSets: ['classic', 'modern', 'mystical', 'romantic']
  }
};

// カードセット情報
const CARD_SET_INFO = {
  classic: {
    name: 'クラシック',
    description: '伝統的なライダー・ウェイト版デザイン',
    imagePrefix: 'classic'
  },
  modern: {
    name: 'モダン',
    description: '現代的で洗練されたデザイン',
    imagePrefix: 'modern'
  },
  mystical: {
    name: 'ミスティカル',
    description: '神秘的で幻想的なアートワーク',
    imagePrefix: 'mystical'
  },
  romantic: {
    name: 'ロマンティック',
    description: '恋愛に特化した美しいデザイン',
    imagePrefix: 'romantic'
  }
};

// ローカルストレージキー
const STORAGE_KEY = 'tarot-user-usage';

// 初期ユーザーデータ
const getInitialUserUsage = (): UserUsage => ({
  planType: 'free',
  monthlyReadingsUsed: 0,
  maxMonthlyReadings: SUBSCRIPTION_SETTINGS.free.maxReadings,
  lastResetDate: new Date().toISOString(),
  selectedCardSet: 'classic',
  registrationDate: new Date().toISOString()
});

// ユーザーデータの取得
export const getUserUsage = (): UserUsage => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = getInitialUserUsage();
      saveUserUsage(initial);
      return initial;
    }

    const usage: UserUsage = JSON.parse(stored);
    
    // 月初リセットチェック
    const lastReset = new Date(usage.lastResetDate);
    const now = new Date();
    
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
      usage.monthlyReadingsUsed = 0;
      usage.lastResetDate = now.toISOString();
      saveUserUsage(usage);
    }
    
    return usage;
  } catch (error) {
    console.error('ユーザーデータの読み込みエラー:', error);
    return getInitialUserUsage();
  }
};

// ユーザーデータの保存
export const saveUserUsage = (usage: UserUsage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch (error) {
    console.error('ユーザーデータの保存エラー:', error);
  }
};

// 使用可能性チェック
export const checkUsageLimit = (): UsageCheckResult => {
  const usage = getUserUsage();
  const remaining = usage.maxMonthlyReadings - usage.monthlyReadingsUsed;
  
  if (remaining <= 0) {
    return {
      canUseReading: false,
      remainingReadings: 0,
      reason: usage.planType === 'free' 
        ? '無料プランの月間利用回数（5回）に達しました。プレミアムプランにアップグレードすると50回まで利用できます。'
        : 'プレミアムプランの月間利用回数（50回）に達しました。来月まで少しお待ちください。'
    };
  }
  
  return {
    canUseReading: true,
    remainingReadings: remaining
  };
};

// 鑑定回数の使用
export const consumeReading = (): boolean => {
  const usage = getUserUsage();
  const check = checkUsageLimit();
  
  if (!check.canUseReading) {
    return false;
  }
  
  usage.monthlyReadingsUsed += 1;
  saveUserUsage(usage);
  return true;
};

// プランのアップグレード
export const upgradeTopremium = (): void => {
  const usage = getUserUsage();
  usage.planType = 'premium';
  usage.maxMonthlyReadings = SUBSCRIPTION_SETTINGS.premium.maxReadings;
  saveUserUsage(usage);
};

// プランのダウングレード
export const downgradeToFree = (): void => {
  const usage = getUserUsage();
  usage.planType = 'free';
  usage.maxMonthlyReadings = SUBSCRIPTION_SETTINGS.free.maxReadings;
  usage.selectedCardSet = 'classic'; // フリープランはクラシックのみ
  saveUserUsage(usage);
};

// カードセットの変更
export const changeCardSet = (cardSet: CardSetType): boolean => {
  const usage = getUserUsage();
  
  // 無料プランは classic のみ
  if (usage.planType === 'free' && cardSet !== 'classic') {
    return false;
  }
  
  usage.selectedCardSet = cardSet;
  saveUserUsage(usage);
  return true;
};

// サブスクリプション設定の取得
export const getSubscriptionSettings = (): SubscriptionSettings => SUBSCRIPTION_SETTINGS;

// カードセット情報の取得
export const getCardSetInfo = () => CARD_SET_INFO;

// プレミアム機能チェック
export const hasPremiumAccess = (): boolean => {
  const usage = getUserUsage();
  return usage.planType === 'premium';
};

// 利用統計の取得
export const getUsageStats = () => {
  const usage = getUserUsage();
  const settings = SUBSCRIPTION_SETTINGS[usage.planType];
  
  return {
    currentPlan: usage.planType,
    usedReadings: usage.monthlyReadingsUsed,
    maxReadings: usage.maxMonthlyReadings,
    remainingReadings: usage.maxMonthlyReadings - usage.monthlyReadingsUsed,
    usagePercentage: Math.round((usage.monthlyReadingsUsed / usage.maxMonthlyReadings) * 100),
    selectedCardSet: usage.selectedCardSet,
    availableFeatures: settings.features,
    resetDate: new Date(usage.lastResetDate)
  };
}; 