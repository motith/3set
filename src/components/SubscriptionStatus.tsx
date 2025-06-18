import React, { useState } from 'react';
import { getUsageStats, hasPremiumAccess } from '../services/subscriptionService';

interface SubscriptionStatusProps {
  onUpgradeClick: () => void;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ onUpgradeClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const stats = getUsageStats();
  const isPremium = hasPremiumAccess();

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-xl p-4 shadow-lg border border-purple-100">
      {/* ヘッダー部分（常時表示） */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-purple-700">
            {isPremium ? '💎 プレミアム' : '🆓 無料プラン'}
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-500 hover:text-purple-700 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {!isPremium && (
          <button
            onClick={onUpgradeClick}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors duration-200"
          >
            アップグレード
          </button>
        )}
      </div>

      {/* 使用回数表示（常時表示） */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-purple-600">今月の利用回数</span>
          <span className="text-sm font-medium text-purple-700">
            {stats.usedReadings} / {stats.maxReadings}回
          </span>
        </div>
        
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              stats.usagePercentage >= 90 
                ? 'bg-red-500' 
                : stats.usagePercentage >= 70 
                ? 'bg-yellow-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(stats.usagePercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-purple-500">0回</span>
          <span className="text-xs text-purple-500">{stats.maxReadings}回</span>
        </div>
      </div>

      {/* 残り回数表示（常時表示） */}
      <div className="text-center mb-3">
        {stats.remainingReadings > 0 ? (
          <p className="text-sm text-purple-600">
            残り <span className="font-semibold text-purple-700">{stats.remainingReadings}回</span> 利用可能
          </p>
        ) : (
          <p className="text-sm text-red-600 font-medium">
            今月の利用回数上限に達しました
          </p>
        )}
      </div>

      {/* 展開可能な詳細部分 */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-purple-100 pt-3 space-y-3">
          {/* プラン特典 */}
          <div>
            <h4 className="text-sm font-medium text-purple-700 mb-2">利用可能な機能:</h4>
            <ul className="space-y-1">
              {stats.availableFeatures.map((feature, index) => (
                <li key={index} className="text-xs text-purple-600 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* 選択中のカードセット */}
          <div className="pt-2 border-t border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-600">カードセット:</span>
              <span className="text-sm font-medium text-purple-700">
                {stats.selectedCardSet === 'classic' && 'クラシック'}
                {stats.selectedCardSet === 'modern' && 'モダン'}
                {stats.selectedCardSet === 'mystical' && 'ミスティカル'}
                {stats.selectedCardSet === 'romantic' && 'ロマンティック'}
              </span>
            </div>
          </div>

          {/* プレミアム機能案内（無料プランのみ） */}
          {!isPremium && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-medium text-purple-700 mb-2">
                💎 プレミアムプランの特典
              </h4>
              <ul className="space-y-1">
                <li className="text-xs text-purple-600 flex items-center">
                  <span className="text-purple-500 mr-2">📈</span>
                  月50回まで鑑定可能
                </li>
                <li className="text-xs text-purple-600 flex items-center">
                  <span className="text-purple-500 mr-2">✍️</span>
                  自由テーマ入力機能
                </li>
                <li className="text-xs text-purple-600 flex items-center">
                  <span className="text-purple-500 mr-2">🎨</span>
                  4種類のカードセット
                </li>
              </ul>
            </div>
          )}

          {/* 次回リセット日 */}
          <div className="text-xs text-purple-500 text-center">
            利用回数は毎月1日にリセットされます
          </div>
        </div>
      </div>
    </div>
  );
}; 