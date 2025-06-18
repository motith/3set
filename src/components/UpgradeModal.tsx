import React from 'react';
import { getSubscriptionSettings } from '../services/subscriptionService';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade 
}) => {
  const settings = getSubscriptionSettings();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              プレミアムプランにアップグレード
            </h2>
            <p className="text-gray-600">
              より多くの鑑定とプレミアム機能をお楽しみください
            </p>
          </div>
        </div>

        {/* プラン比較 */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 gap-4">
            {/* 無料プラン */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">🆓 無料プラン</h3>
                <span className="text-sm text-gray-500">現在のプラン</span>
              </div>
              <ul className="space-y-2">
                {settings.free.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* プレミアムプラン */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-700">💎 プレミアムプラン</h3>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  おすすめ
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {settings.premium.features.map((feature, index) => (
                  <li key={index} className="text-sm text-purple-700 flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 特別なメリット */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
              <span className="mr-2">🌟</span>
              プレミアム限定特典
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">📈</span>
                <span className="text-sm text-purple-700">月5回 → 50回に大幅増加</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">🎨</span>
                <span className="text-sm text-purple-700">4種類のタロットカードセット</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">🔮</span>
                <span className="text-sm text-purple-700">高精度AI鑑定エンジン</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">⚡</span>
                <span className="text-sm text-purple-700">優先サポート</span>
              </div>
            </div>
          </div>

          {/* 価格情報（デモ版） */}
          <div className="mt-6 text-center">
            <div className="text-3xl font-bold text-purple-700 mb-2">
              ¥980<span className="text-lg text-purple-500">/月</span>
            </div>
            <p className="text-sm text-purple-600 mb-4">
              初回30日間無料トライアル
            </p>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              今すぐプレミアムを開始
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              後で決める
            </button>
          </div>

          {/* 注意事項 */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>※ デモ版のため、実際の決済は発生しません</p>
            <p>※ 本実装時はStripe等の決済システムを統合予定</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 