## 仕様
* 弾をアイコンへ変更。
* 敵x2種類、ボスキャラオブジェクト作成(それぞれ速度やヒット音調整)。
* ボスは1体で垂直へ往復移動しながら炎を吐く。
* 効果音使用(弾発射音、弾ヒット音、ダメージ音、ゲームオーバ音、クリア音)。
* BGM(chromeでは音が自動作成されないため、画面をStartでマスクしてイベント発行後)。
* プレーヤー位置からoffsetさせて弾の発射位置精度あげ。
* スコア化。1000点でボス登場、2000点(ボスへ弾10発命中)でクリア。
* 敵接触、またはボスキャラ炎に当たるとダメージを受けライフ－1。
* ライフ0点になるとゲームオーバ音(ゲーム終了はさせない仕様)。
* ページ遷移(オープニング(index.htmlクリック)→ゲーム画面(mariogame.html)→エンディング画面(ending.html))。