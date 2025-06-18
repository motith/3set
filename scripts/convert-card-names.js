const fs = require('fs');
const path = require('path');

// タロットカード番号とIDの対応表（大アルカナ）
const cardMapping = {
  0: 'fool',           // 愚者
  1: 'magician',       // 魔術師
  2: 'high-priestess', // 女教皇
  3: 'empress',        // 女帝
  4: 'emperor',        // 皇帝
  5: 'hierophant',     // 教皇
  6: 'lovers',         // 恋人
  7: 'chariot',        // 戦車
  8: 'strength',       // 力
  9: 'hermit',         // 隠者
  10: 'wheel-of-fortune', // 運命の輪
  11: 'justice',       // 正義
  12: 'hanged-man',    // 吊られた男
  13: 'death',         // 死神
  14: 'temperance',    // 節制
  15: 'devil',         // 悪魔
  16: 'tower',         // 塔
  17: 'star',          // 星
  18: 'moon',          // 月
  19: 'sun',           // 太陽
  20: 'judgement',     // 審判
  21: 'world'          // 世界
};

// ファイル名変換関数
function convertCardFiles(sourceDir, targetDir) {
  console.log('🃏 タロットカード画像ファイル名変換開始...\n');
  
  // ターゲットディレクトリが存在しない場合は作成
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  let convertedCount = 0;
  let errorCount = 0;
  
  // 0から21まで順番に処理
  for (let i = 0; i <= 21; i++) {
    const sourceFile = path.join(sourceDir, `${i}.png`);
    const cardId = cardMapping[i];
    const targetFile = path.join(targetDir, `${cardId}.png`);
    
    try {
      if (fs.existsSync(sourceFile)) {
        // ファイルをコピー
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ ${i}.png → ${cardId}.png`);
        convertedCount++;
      } else {
        console.log(`⚠️  ${i}.png が見つかりません`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ ${i}.png の変換に失敗: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 変換結果:`);
  console.log(`✅ 成功: ${convertedCount}枚`);
  console.log(`❌ エラー: ${errorCount}枚`);
  console.log(`📁 出力先: ${targetDir}`);
  
  if (convertedCount > 0) {
    console.log('\n🎉 変換完了！アプリでタロットカード画像をお楽しみください。');
  }
}

// 使用方法の表示
function showUsage() {
  console.log('🃏 タロットカード画像ファイル名変換ツール\n');
  console.log('使用方法:');
  console.log('node scripts/convert-card-names.js <source-directory> [target-directory]\n');
  console.log('例:');
  console.log('node scripts/convert-card-names.js ./cardset');
  console.log('node scripts/convert-card-names.js ./cardset ./public/images/tarot-cards\n');
  console.log('対応表:');
  Object.entries(cardMapping).forEach(([num, id]) => {
    console.log(`  ${num}.png → ${id}.png`);
  });
}

// メイン処理
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showUsage();
    return;
  }
  
  const sourceDir = args[0];
  const targetDir = args[1] || './public/images/tarot-cards';
  
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ ソースディレクトリが見つかりません: ${sourceDir}`);
    return;
  }
  
  convertCardFiles(sourceDir, targetDir);
}

// スクリプト実行
main(); 