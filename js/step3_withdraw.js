const Web3 = require('web3');
const fs = require('fs');
const abi = require('ethereumjs-abi');
const util = require('ethereumjs-util');
const BN = require('bn.js');

// 生成したウォレットのアドレス
const walletAddress = '0x8DDA0Dd5696b29C7607bfa5e3073dD5902F3c110';

// eth-multisig-v2 でコンパイルしたコントラクトを読み込む。
const contract = JSON.parse(fs.readFileSync('../build/contracts/WalletSimple.json', 'utf8'));

// ノードを指定
const web3 = new Web3('ws://localhost:8545');

var serializeSignature = ({ r, s, v }) =>
    '0x' + Buffer.concat([r, s, Buffer.from([v])]).toString('hex');

(async function () {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];

    // コントラクトオブジェクトの生成
    let wallet = new web3.eth.Contract(contract.abi, walletAddress);

    // 入出金前残高確認
    console.log("balance0       = " + await web3.eth.getBalance(accounts[0]));
    console.log("balance3       = " + await web3.eth.getBalance(accounts[3]));
    console.log("balance wallet = " + await web3.eth.getBalance(wallet.options.address));

    // ウォレットから出金
    console.log("出金");

    // multisig 出金に必要な署名を作成
    const destinationAccount = accounts[0];
    const amount = '1';
    const expireTime = Math.floor((new Date().getTime()) / 1000) + 60; // 60 seconds
    const data = 'aa';
    const wei = web3.utils.toWei(amount, 'ether');

    const sequenceIdString = await wallet.methods.getNextSequenceId().call();
    const sequenceId = parseInt(sequenceIdString);

    const hash = web3.utils.soliditySha3(
	{ t: 'string', v: 'ETHER' },
	{ t: 'address', v: destinationAccount },
	{ t: 'uint', v: wei },
	{ t: 'string', v: data },
	{ t: 'uint', v: expireTime },
	{ t: 'uint', v: sequenceId }
    );

    // account1's
    const privateKey = Buffer.from('7546f96bbafce40001771f904a690f90b674d47e2a610b14f3a217dd9af7beec', "hex");
    const sig = util.ecsign(util.toBuffer(hash), privateKey);

    const serialize = serializeSignature(sig);

    // 出金
    const method = wallet.methods.sendMultiSig(
	destinationAccount, wei, Buffer.from(data), expireTime, sequenceId, serialize
    );

    const gas = await method.estimateGas();
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gas = " + gas);
    console.log("gasPrice = " + gasPrice);

    method.send({
	from: owner,
	gas: gas,
	gasPrice: gasPrice
    });

    console.log("balance0 = " + await web3.eth.getBalance(accounts[0]));
    console.log("balance3 = " + await web3.eth.getBalance(accounts[3]));
    console.log("balance wallet = " + await web3.eth.getBalance(wallet.options.address));

    web3.currentProvider.disconnect();
})();

