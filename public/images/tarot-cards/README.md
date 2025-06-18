# タロットカード画像ファイル配置ガイド

このディレクトリにタロットカードの画像ファイルを配置してください。

## 📁 ファイル命名規則

各大アルカナカードの画像ファイル名は、以下の形式で命名してください：

```
{card-id}.png
```

## 🃏 カードID一覧

| 番号 | カード名 | ファイル名 |
|-----|---------|-----------|
| 0 | 愚者 | `fool.png` |
| 1 | 魔術師 | `magician.png` |
| 2 | 女教皇 | `high-priestess.png` |
| 3 | 女帝 | `empress.png` |
| 4 | 皇帝 | `emperor.png` |
| 5 | 教皇 | `hierophant.png` |
| 6 | 恋人 | `lovers.png` |
| 7 | 戦車 | `chariot.png` |
| 8 | 力 | `strength.png` |
| 9 | 隠者 | `hermit.png` |
| 10 | 運命の輪 | `wheel-of-fortune.png` |
| 11 | 正義 | `justice.png` |
| 12 | 吊られた男 | `hanged-man.png` |
| 13 | 死神 | `death.png` |
| 14 | 節制 | `temperance.png` |
| 15 | 悪魔 | `devil.png` |
| 16 | 塔 | `tower.png` |
| 17 | 星 | `star.png` |
| 18 | 月 | `moon.png` |
| 19 | 太陽 | `sun.png` |
| 20 | 審判 | `judgement.png` |
| 21 | 世界 | `world.png` |

## 🔄 自動ファイル名変換

数字ファイル名（0.png〜21.png）から自動変換するスクリプトを用意しています：

```bash
# cardsetディレクトリから変換
node scripts/convert-card-names.js ./cardset

# カスタムディレクトリから変換
node scripts/convert-card-names.js /path/to/your/cards ./public/images/tarot-cards
```

## 🖼️ 画像仕様

- **形式**: PNG推奨、SVG・JPG対応
- **アスペクト比**: 2:3（縦長）
- **推奨サイズ**: 200×300px以上
- **最大ファイルサイズ**: 500KB以下（読み込み速度のため）

## 📋 フォールバック順序

画像が見つからない場合、以下の順序で検索されます：

1. `{card-id}.png` （優先）
2. `{card-id}.svg`
3. `{card-id}.jpg`
4. `placeholder.svg` （最終フォールバック）

## 📋 現在の状態

- ✅ `placeholder.svg` - プレースホルダー画像
- ✅ サンプル画像（SVG形式）
  - `fool.svg`
  - `magician.svg`
  - `lovers.svg`
- ❌ 大アルカナ22枚の画像ファイル（要追加）

## 🚀 使用方法

### 方法1: 手動配置
1. 上記の命名規則に従って画像ファイルを準備
2. このディレクトリに配置
3. アプリを再読み込み

### 方法2: 自動変換（推奨）
1. `cardset`ディレクトリに0.png〜21.pngを配置
2. 変換スクリプトを実行：
   ```bash
   node scripts/convert-card-names.js ./cardset
   ```
3. アプリを再読み込み

画像が見つからない場合は、自動的にプレースホルダー画像が表示されます。 