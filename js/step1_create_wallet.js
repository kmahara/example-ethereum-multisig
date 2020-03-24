const Web3 = require('web3');
const fs = require('fs');

// eth-multisig-v2 でコンパイルしたコントラクトを読み込む。
const contract = JSON.parse(fs.readFileSync('../build/contracts/WalletSimple.json', 'utf8'));

// ノードを指定
const web3 = new Web3('ws://localhost:8545');

(async function () {
    const accounts = await web3.eth.getAccounts();

    // ウォレットの所有者
    const owner = accounts[0];

    // コントラクトオブジェクトの生成
    let WalletSimple = new web3.eth.Contract(contract.abi);

    let options = {
	arguments: [[accounts[0], accounts[1], accounts[2]]],
	data: contract.bytecode
    };

    const gas = await WalletSimple.deploy(options).estimateGas();
    const gasPrice = await web3.eth.getGasPrice();

    console.log("gas: " + gas);
    console.log("gasPrice: " + gasPrice);

    const wallet = await WalletSimple.deploy(options).send({
	from: owner,
	gas: gas,
	gasPrice: gasPrice
    });
    console.log("wallet address: " + wallet.options.address);

    web3.currentProvider.disconnect();
})();

