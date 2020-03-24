var Web3 = require('web3');

// ノードを指定
const web3 = new Web3('ws://localhost:8545');

(async function () {
    // このノードのアカウント一覧を取得
    var accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    // アカウントの秘密鍵を取得。秘密鍵の内容自体はみることができないっぽい。
    accounts.forEach(function(account) {
	var key = web3.eth.accounts.privateKeyToAccount(account);
	console.log(key);
    });
})();

