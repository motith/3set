# 🃏 タロットカード画像セットアップガイド

このガイドでは、数字ファイル名（0.png〜21.png）のタロットカード画像を、アプリで使用できる形式に変換する方法を説明します。

## 📋 前提条件

- タロットカード画像ファイル（0.png〜21.png）が準備されている
- ファイルは大アルカナの順番（0=愚者、1=魔術師...21=世界）で並んでいる

## 🚀 セットアップ手順

### ステップ1: 画像ファイルの配置

1. プロジェクトルートに `cardset` ディレクトリを作成
2. 0.png〜21.png のファイルを配置

```
プロジェクトルート/
├── cardset/
│   ├── 0.png    # 愚者
│   ├── 1.png    # 魔術師
│   ├── 2.png    # 女教皇
│   │   ...
│   ├── 20.png   # 審判
│   └── 21.png   # 世界
└── scripts/
    └── convert-card-names.js
```

### ステップ2: ファイル名変換の実行

```bash
# 変換スクリプトを実行
node scripts/convert-card-names.js ./cardset

# または、カスタムパスを指定
node scripts/convert-card-names.js /path/to/your/cardset
```

### ステップ3: 変換結果の確認

変換が成功すると、以下のような出力が表示されます：

```
🃏 タロットカード画像ファイル名変換開始...

✅ 0.png → fool.png
✅ 1.png → magician.png
✅ 2.png → high-priestess.png
...
✅ 21.png → world.png

📊 変換結果:
✅ 成功: 22枚
❌ エラー: 0枚
📁 出力先: ./public/images/tarot-cards

🎉 変換完了！アプリでタロットカード画像をお楽しみください。
```

## 📁 変換後のファイル構成

```
public/images/tarot-cards/
├── fool.png              # 0.png → 愚者
├── magician.png           # 1.png → 魔術師
├── high-priestess.png     # 2.png → 女教皇
├── empress.png            # 3.png → 女帝
├── emperor.png            # 4.png → 皇帝
├── hierophant.png         # 5.png → 教皇
├── lovers.png             # 6.png → 恋人
├── chariot.png            # 7.png → 戦車
├── strength.png           # 8.png → 力
├── hermit.png             # 9.png → 隠者
├── wheel-of-fortune.png   # 10.png → 運命の輪
├── justice.png            # 11.png → 正義
├── hanged-man.png         # 12.png → 吊られた男
├── death.png              # 13.png → 死神
├── temperance.png         # 14.png → 節制
├── devil.png              # 15.png → 悪魔
├── tower.png              # 16.png → 塔
├── star.png               # 17.png → 星
├── moon.png               # 18.png → 月
├── sun.png                # 19.png → 太陽
├── judgement.png          # 20.png → 審判
└── world.png              # 21.png → 世界
```

## ✨ アプリでの表示確認

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. ブラウザで `http://localhost:3000` にアクセス

3. 鑑定を実行して、タロットカード画像が表示されることを確認

## 🔧 トラブルシューティング

### 画像が表示されない場合

1. **ファイル名を確認**
   - 正確に0.png〜21.pngの形式になっているか
   - ファイル拡張子が小文字の.pngになっているか

2. **ファイルサイズを確認**
   - 各ファイルが500KB以下であることを推奨
   - 大きすぎる場合は圧縮を検討

3. **変換ログを確認**
   - エラーメッセージが出ていないか
   - 全22枚が正常に変換されているか

### スクリプトエラーの場合

```bash
# ヘルプを表示
node scripts/convert-card-names.js --help

# ディレクトリの存在確認
ls -la ./cardset
```

## 🎨 画像要件

- **形式**: PNG推奨（透明背景対応）
- **サイズ**: 200×300px以上
- **アスペクト比**: 2:3（縦長）
- **ファイルサイズ**: 500KB以下推奨
- **色深度**: 24bit以上

## 📞 サポート

問題が発生した場合は、以下の情報を確認してください：

1. 変換スクリプトの出力ログ
2. ブラウザの開発者コンソールエラー
3. ファイルの存在とアクセス権限
4. 画像ファイルの形式と破損チェック 