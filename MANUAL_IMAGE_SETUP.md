# タロットカード画像の手動配置手順

## 概要
アップロードされた22枚のタロットカード画像を適切にプロジェクトに配置する手順です。

## 配置先ディレクトリ
```
public/images/tarot-cards/
```

## 画像ファイルの命名規則

アップロードされた画像を以下のファイル名で保存してください：

### 大アルカナカード対応表

| 順序 | カード名（日本語） | ファイル名 | 説明 |
|------|-------------------|------------|------|
| 1    | 愚者              | fool.jpg   | フードを被った神秘的な人物 |
| 2    | 魔術師            | magician.jpg | 手を上げて魔法を使う人物 |
| 3    | 女教皇            | high-priestess.jpg | 月の神秘性を表す人物 |
| 4    | 女帝              | empress.jpg | 豊穣と創造性の象徴 |
| 5    | 皇帝              | emperor.jpg | 権威と安定の象徴 |
| 6    | 教皇              | hierophant.jpg | 精神的指導者 |
| 7    | 恋人              | lovers.jpg | 赤い糸で結ばれた二人 |
| 8    | 戦車              | chariot.jpg | 勝利と意志力の象徴 |
| 9    | 力                | strength.jpg | 内なる力と勇気 |
| 10   | 隠者              | hermit.jpg | ランタンを持つ賢者 |
| 11   | 運命の輪          | wheel-of-fortune.jpg | 運命と変化の輪 |
| 12   | 正義              | justice.jpg | 天秤を持つ正義の女神 |
| 13   | 吊られた男        | hanged-man.jpg | 逆さまに吊られた人物 |
| 14   | 死神              | death.jpg | 変化と再生の象徴 |
| 15   | 節制              | temperance.jpg | 調和とバランスの天使 |
| 16   | 悪魔              | devil.jpg | 誘惑と束縛の象徴 |
| 17   | 塔                | tower.jpg | 突然の変化と破壊 |
| 18   | 星                | star.jpg | 希望と導きの星 |
| 19   | 月                | moon.jpg | 幻想と直感の月 |
| 20   | 太陽              | sun.jpg | 成功と喜びの太陽 |
| 21   | 審判              | judgement.jpg | 復活と新たな始まり |
| 22   | 世界              | world.jpg | 完成と達成の象徴 |

## 手動配置の手順

### ステップ1: ディレクトリの確認
```bash
ls -la public/images/tarot-cards/
```

### ステップ2: 画像ファイルの配置
1. アップロードされた22枚の画像を上記の対応表に従って適切なファイル名で保存
2. 各ファイルを `public/images/tarot-cards/` ディレクトリに配置
3. ファイル拡張子は `.jpg` を使用

### ステップ3: 配置確認
```bash
ls -la public/images/tarot-cards/*.jpg
```

以下の22個のファイルが存在することを確認：
- fool.jpg
- magician.jpg
- high-priestess.jpg
- empress.jpg
- emperor.jpg
- hierophant.jpg
- lovers.jpg
- chariot.jpg
- strength.jpg
- hermit.jpg
- wheel-of-fortune.jpg
- justice.jpg
- hanged-man.jpg
- death.jpg
- temperance.jpg
- devil.jpg
- tower.jpg
- star.jpg
- moon.jpg
- sun.jpg
- judgement.jpg
- world.jpg

### ステップ4: アプリケーションの動作確認
1. 開発サーバーを起動: `npm run dev`
2. ブラウザで http://localhost:3000 にアクセス
3. タロット鑑定を実行してカード画像が正しく表示されることを確認

## トラブルシューティング

### 画像が表示されない場合
1. ファイル名が正確であることを確認
2. ファイル拡張子が `.jpg` であることを確認
3. ファイルが `public/images/tarot-cards/` ディレクトリに配置されていることを確認
4. ブラウザのキャッシュをクリアして再読み込み

### フォールバック機能
画像が読み込めない場合、以下の順序で代替画像を試行します：
1. `cardname.jpg` (メイン)
2. `cardname.png` (代替1)
3. `cardname.svg` (代替2)
4. `placeholder.svg` (最終フォールバック)

## 注意事項
- 画像ファイルのサイズが大きすぎる場合は、適切にリサイズしてください（推奨: 幅400px程度）
- ファイル名は必ず小文字とハイフンを使用してください
- 日本語文字は使用しないでください 