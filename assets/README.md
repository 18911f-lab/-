# 渋谷ゴミ分別TA 素材パック

この会話で作ったドット絵素材一式です。すべてSVG（矩形のみ）で描いてあり、PNGはそこから整数倍で書き出しています。

**ゴミ箱・どらごん・フィルムなどは仮素材です。すみさんの実アセットに差し替える前提で使ってください。**

## フォルダ

- `sprites/svg` ・ `sprites/png` : 単体スプライト。PNGは等倍（@1x）と4倍、8倍。ゲームに入れるときは@1xを読み込み、**ニアレストネイバー**で拡大するのが正解です。
- `backgrounds/` : 背景の合成画像。横画面は320x180（1x、3x、6x）、縦画面は130x281（1x）と、アプリで使った390x844。PNGは看板の文字を抜いてあります。
- `layers_wide/` : 横画面背景を9枚のレイヤーに分けたもの（パララックス用）。
- `layers_tall/` : 縦画面背景を6枚に分けたもの。
- `palette/` : 使った色の一覧（`.hex`はLospec形式、`.gpl`はGIMP/Aseprite向け）とスウォッチ画像。
- `source/` : キャンバス上のデザインのHTMLそのまま（UI枠のCSSなど）。
- `preview_sprites.png` : 単体スプライトの一覧。

## レイヤーの重ね順（下から）

横画面: 01_sky → 02_far_buildings → 03_viaduct → 04_train → 05_mid_buildings_neon → 06_road → 07_streetlamps → 08_sidewalk → 09_garbage_piles
縦画面: 01_sky → 02_far_buildings → 03_near_buildings_neon → 04_road → 05_garbage_piles → 06_sidewalk

パララックスの目安は、`01_sky`を最も遅く、`02_far_buildings`、`03_viaduct`と`04_train`、`05_mid_buildings_neon`の順に速くし、`06_road`以降は等速です。電車は`04_train`をx方向に流すだけで動きます。

## スプライト一覧（内部ピクセルサイズ）

- `heart` : 9x8
- `icon_sound` : 10x10
- `glow_pixel` : 25x25
- `item_film_negative` : 24x24
- `bin_kanen_red` : 20x28
- `bin_funen_blue` : 20x28
- `bin_shigen_green` : 20x28
- `bin_sodai_crate` : 20x28
- `dragon_zasshoku` : 20x15
- `relic_coin` : 8x8
- `relic_clock` : 8x8
- `relic_star` : 8x8
- `relic_broom` : 8x8

## 注意

- 看板の文字（ゲーセン、ラーメン、24H、SALE、SHIBUYA）はSVGにだけ入っていて、フォントはDotGothic16（Google Fonts配布）です。PNGでは文字を抜いた空の看板にしてあるので、好きなフォントで載せ直せます。
- UIの枠（角の欠けた四角）は画像ではなく、CSSの`box-shadow`4方向で作っています。`source/`のHTMLを参照してください。
- `glow_pixel`は半透明の同心の十字形で、ゴミの背後に敷く光です。
