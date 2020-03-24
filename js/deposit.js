/**
 * 出金処理
 *
 * fromAddress から toAddress に amount ETH 送金する。
 */
const Web3 = require('web3');
const fs = require('fs');

// ノードを指定
const web3 = new Web3('ws://localhost:8545');

(async function () {
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[1];
    const toAddress = accounts[0];
    cont amount = '50';

    console.log("## before");
    console.log("balance toAddress = " + await web3.eth.getBalance(toAddress));
    console.log("balance fromAddress = " + await web3.eth.getBalance(fromAddress));

    // 送金
    await web3.eth.sendTransaction({
	from: fromAddress,
	to: toAddress,
	value: web3.utils.toWei(amount, 'ether')
    });
    console.log("## after");
    console.log("balance toAddress = " + await web3.eth.getBalance(toAddress));
    console.log("balance fromAddress = " + await web3.eth.getBalance(fromAddress));

    web3.currentProvider.disconnect();
})();

