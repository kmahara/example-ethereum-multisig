## 概要

BitGo の eth-multisig-v2 のウォレット・コントラクトを使って入出金するサンプルプログラム。

## ファイル説明

- js/*.js - ウォッレットを扱うサンプルプログラム。Node.js で書かれています。
- contract/WalletSimple.sol - eth-multisig-v2 のウォレットベースに修正したコントラクト。 
- Solidity 0.5.0 に対応するための修正を加え、また今回はトークンを扱わないのと余計な 0.5.0 対応工数をへらすため、トークン関連処理は削除してあります。

## 初期化

```
nvm use v13.9.0
npm install
./node_modules/.bin/truffle compile
```

## サンプルの実行手順

### 1. Ganache を起動し、Ethereum サーバを稼働します。 

ACCOUNTS タブを見ると 10 個のアドレス、及びそれぞれ 100 ETH 保持していることがわかります。 
BLOCKS タブを見るとブロック 0 の状態、 
TRANSACTIONS タブには何もない状態。ここから始めます。 
 
また、何度かサンプルを実行していて各アカウントやウォレットの残高がなくなった場合、Ganache を再起動すれば元の状態に戻すことができます。
 
### 2. ウォレット作成

```
cd js/
node step1_create_wallet.js
```

実行すると、account[0] でウォレットのコントラクトをデプロイします。 
その結果、以下の変化が発生します。Ganache上で確認してください。
- ACCOUNTS タブ: account[0] は GAS 及びトランザクションフィーを消費し、0.02 ETH ほど残高が減ります。
- BLOCKS タブ: BLOCK 1 が増えています。BLOCK 1 をクリックするとトランザクションが１つ含まれ、それが CONTRACT CREATION であることがわかります。 
さらにそのトランザクションをクリックすると、TXDATA にはコントラクトのバイナリデータが格納されているのを見ることができます。

### 3. ウォレットに入金

Ganache で初期状態でウォレットをデプロイするとアドレスは以下の値になりますが、環境やサーバによっては異なる値になるかもしれません。

```
0x8DDA0Dd5696b29C7607bfa5e3073dD5902F3c110
```

その場合は step2 以降のファイルを編集し、walletAddress を変更してください。 
そして以下のコマンドを実行し、account[0] からウォレットに 20 ETH 入金します。

```
node step2_deposit.js
```

- ACCOUNT タブ: account[0] から 20 ETH 残高が減っています。
- BLOCKS タブ: BLOCK 2 が生成され、CONTRACT CALL トランザクションが記録されています。 
入金処理なので TXDATA には空で、VALUE に 20 ETH となります。

### 4. ウォレットから出金

ウォレットから account[0] に 1 ETH 送金します。 
出金の際は multisig を利用します。

```
node step3_withdraw.js
```

- BLOCK タブ: BLOCK 3 が生成され、CONTRACT CALL トランザクションが記録され、
今回はコントラクトのメソッド呼び出しのため、VALUE は 0 で、TXDATA にバイナリ化されたメソッド呼び出しデータが含まれています。
