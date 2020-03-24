const Web3 = require('web3');
const fs = require('fs');

// 生成したウォレットのアドレス
const walletAddress = '0x8DDA0Dd5696b29C7607bfa5e3073dD5902F3c110';

// eth-multisig-v2 でコンパイルしたコントラクトを読み込む。
const contract = JSON.parse(fs.readFileSync('../build/contracts/WalletSimple.json', 'utf8'));

// ノードを指定
const web3 = new Web3('ws://localhost:8545');

(async function () {
    const accounts = await web3.eth.getAccounts();

    // ウォレットの所有者
    const owner = accounts[0];

    // コントラクトオブジェクトの生成
    let wallet = new web3.eth.Contract(contract.abi, walletAddress);

    console.log("wallet address: " + wallet.options.address);

    // 状態遷移を伴わないため gas のかからないメソッドを呼び出し
    let isSigner0 = await wallet.methods.isSigner(accounts[0]).call();
    let isSigner3 = await wallet.methods.isSigner(accounts[3]).call();
    console.log("isSigner0 = " + isSigner0);
    console.log("isSigner3 = " + isSigner3);

    // 入出金前残高確認
    console.log("balance0       = " + await web3.eth.getBalance(accounts[0]));
    console.log("balance3       = " + await web3.eth.getBalance(accounts[3]));
    console.log("balance wallet = " + await web3.eth.getBalance(wallet.options.address));

    // ウォレットへ入金
    console.log("入金");
    await web3.eth.sendTransaction({
	from: accounts[0],
	to: wallet.options.address,
	value: web3.utils.toWei('20', 'ether')
    });
    console.log("balance0 = " + await web3.eth.getBalance(accounts[0]));
    console.log("balance3 = " + await web3.eth.getBalance(accounts[3]));
    console.log("balance wallet = " + await web3.eth.getBalance(wallet.options.address));

    web3.currentProvider.disconnect();
})();

