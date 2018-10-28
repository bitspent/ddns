/*
 * dns contract client
 */
const DNSContract = {

	/* 
	 * contract ABI 
	 */
	abi : [{ "constant": false, "inputs": [], "name": "settle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" 	}, 	{ "constant": false, "inputs": [  	{   "name": "_site",   "type": "bytes32"  	},  	{   "name": "_holder",   "type": "address"  	}  ], "name": "transferDomain", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" 	}, 	{ "constant": false, "inputs": [  	{   "name": "_site",   "type": "bytes32"  	}  ], "name": "claimDomain", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" 	}, 	{ "constant": false, "inputs": [  	{   "name": "_domain",   "type": "bytes32"  	},  	{   "name": "_connector",   "type": "string"  	},  	{   "name": "_rawHtml",   "type": "string"  	}  ], "name": "register", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" 	}, 	{ "constant": true, "inputs": [  	{   "name": "_domain",   "type": "bytes32"  	}  ], "name": "domainHtml", "outputs": [  	{   "name": "",   "type": "string"  	}  ], "payable": false, "stateMutability": "view", "type": "function" 	}, 	{ "constant": true, "inputs": [  	{   "name": "_site",   "type": "bytes32"  	}  ], "name": "domainHolder", "outputs": [  	{   "name": "",   "type": "address"  	}  ], "payable": false, "stateMutability": "view", "type": "function" 	}, 	{ "constant": false, "inputs": [  	{   "name": "_site",   "type": "bytes32"  	},  	{   "name": "_rawHtml",   "type": "string"  	}  ], "name": "changeHtml", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" 	}, 	{ "constant": true, "inputs": [  	{   "name": "_domain",   "type": "bytes32"  	}  ], "name": "domainConnector", "outputs": [  	{   "name": "",   "type": "string"  	}  ], "payable": false, "stateMutability": "view", "type": "function" 	}, 	{ "constant": false, "inputs": [  	{   "name": "_site",   "type": "bytes32"  	},  	{   "name": "_connector",   "type": "string"  	}  ], "name": "changeConnector", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" 	}, 	{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" 	}, 	{ "anonymous": false, "inputs": [  	{   "indexed": true,   "name": "holder",   "type": "address"  	},  	{   "indexed": true,   "name": "domain",   "type": "bytes32"  	}  ], "name": "DomainRegistered", "type": "event" 	}, 	{ "anonymous": false, "inputs": [  	{   "indexed": true,   "name": "holder",   "type": "address"  	},  	{   "indexed": true,   "name": "domain",   "type": "bytes32"  	}  ], "name": "ConnectorChange", "type": "event" 	}, 	{ "anonymous": false, "inputs": [  	{   "indexed": true,   "name": "holder",   "type": "address"  	},  	{   "indexed": true,   "name": "domain",   "type": "bytes32"  	}  ], "name": "RawHtmlChange", "type": "event" 	}, 	{ "anonymous": false, "inputs": [  	{   "indexed": true,   "name": "_old",   "type": "address"  	},  	{   "indexed": true,   "name": "_new",   "type": "address"  	},  	{   "indexed": true,   "name": "domain",   "type": "bytes32"  	}  ], "name": "DomainTransfer", "type": "event" 	} ],

	/* 
	 * contract ROPSTEN address 
	 */
	address : '0x74f169ca6d34fae11648b3334028ee4c8c4ab7e7',
	
	/* 
	 * get the contract instance 
	 */
	instance : function () {
		return web3.eth.contract(DNSContract.abi).at(DNSContract.address);
	},
	
	/* 
	 * ETH web3 client 
	 */
	eth : function() {
		let eth = new Eth(TestRPC.provider());
		if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined'){
			console.log('web3 provider found');
			eth.setProvider(window.web3.currentProvider);
		} else {
			presenter.toast('Web3 Not Supported Browser <br> Try Metamask!');
		}
		return eth;
	},
	
	/*
	 * Get Default Account[0] 
	 */
	getUser : async () => {
		return new Promise((resolve, reject) => {
			DNSContract.eth().accounts().then(function(accounts) {
				return resolve(accounts[0]);
			});
		});
	},
	
	/*
	 * Transact Domain Registration
	 */
	registerDomain : function(address, domain, connector, rawHtml) {
		return new Promise((resolve, reject) => {
			DNSContract
				.instance()
				.register(domain, connector, rawHtml, {
						value: 10**15, 
						from: address
					}, function (err, res) {
					if (err) {
						console.log(err);
					} else {
						console.log(res);
					}
				});
		});
	},
	
	/*
	 * Get Domain Holder Address
	 */
	checkDomain : async function(domain) {
		return new Promise((resolve, reject) => {
			DNSContract
				.instance()
				.domainHolder
				.call(domain, function (err, res) {
					if(err) {
						console.log(err);
						reject(err);
					} else {
						console.log(res);
						resolve(res);
					}
				});
		});
	},
	
	/* 
	 * Attach to User Domain Registration Event
	 */
	watchUserDomains : function(user, callback) {
		console.log(`searching for user domains ${user}`);
		DNSContract
			.instance()
			.DomainRegistered({holder: user}, { fromBlock: 0, toBlock: 'latest'})
			.watch(function (error, event) {
				if (!error) {
					console.log(event);					
					callback(event['args'])
				} else {
					console.log(`error while watching domain registration event: ${error}`);
				}
			});
	},
	
	/* 
	 * Attach to All Domain Registration Event
	 */
	watchUsersDomains : function(callback) {
		console.log(`searching for recent domains`);
		DNSContract
			.instance()
			.DomainRegistered({ }, {fromBlock: 0, toBlock: 'latest'})
			.watch(function (error, event) {
				if (!error) {
					console.log(event);					
					callback(event['args'], event['transactionHash'])
				} else {
					console.log(`error while watching domain registration event: ${error}`);
				}
			});
	}
};