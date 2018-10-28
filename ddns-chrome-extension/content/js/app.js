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
	}
};

let App = {
    web3Provider: null,
    account: null,
    DNSContractInstance: null,
    DNSContractAddress: '0x74f169ca6d34fae11648b3334028ee4c8c4ab7e7',
    DNSContract_URL: 'https://gist.githubusercontent.com/toolazytobetrue/083ad42fb570817091f75d24aafe6b79/raw/e0943e6dfd2ac74fb8b68a215994d5ae70c359f9/DNSContract.json',

    initWeb3: async () => {
        return new Promise((resolve, reject) => {
            if (typeof web3 !== 'undefined') {
                App.web3Provider = web3.currentProvider;
            } else {
                App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/plnAtKGtcoxBtY9UpS4b');
            }
            web3 = new Web3(App.web3Provider);
            if (web3 == null || typeof web3 === 'undefined') {
                return reject("Something went wrong");
            } else {
                return resolve("Successfully connected to Web3 Provider.");
            }
        });
    },


    register: async () => {
        let dns_domain = $('#dns_domain').val();
        let dns_connector = $('#dns_connector').val();
        let dns_raw = $('#dns_raw').val();

        App.DNSContractInstance.register(dns_domain, dns_connector, dns_raw, {
            from: App.account,
            value: 0.0015 * 1e18
        }, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                window.open(`https://ropsten.etherscan.io/tx/${res}`, '_blank');
                window.focus();
            }
        });
    },

    getDomainConnector: function (domain) {
        return new Promise((resolve, reject) => {
            DNSContract.instance().domainConnector(web3.fromAscii('fadyaro'), function (err, res) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res);
                }
            });
        });
    },

    getDomainHtml: function (domain) {
        return new Promise((resolve, reject) => {
            App.DNSContractInstance.domainHtml(domain, {
                from: App.account
            }, function (err, res) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(res);
                }
            });
        });
    },

    load: async () => {
        
		
    },

    fetchDomain: async () => {
        let dns_domain = $('#dns_domain').val();
        let domainConnector = await App.getDomainConnector(dns_domain);
        let domainHtml = await App.getDomainHtml(dns_domain);
        console.log(domainConnector);
        $("#dns_output").html(domainHtml);
    },

    fetchConnector: async (type) => {
        // let domainConnector = await App.getDomainConnector(dns_domain);
        // let data;
        // $("#dns_output").html(data);
        console.log(type)
        let choice = "ipfs";
        // let url = "";
        let dns_domain = $('#dns_connector').val();
        // console.log(`DNS Domain: ${dns_domain}`);
        //
        if (type === "ipfs") {
            cURL(`https://gateway.ipfs.io/ipfs/${dns_domain}`);
        } else if (type === "url") {
            cURL(dns_domain);
        }
    },
};


function cURL(url) {
    $.ajax({
        method: "GET",
        url: url,
        data: {}
    })
        .done(data => {
            console.log(data)
            $("#dns_output").html(data);
        })
        .catch(err => {
            switch (err.status) {
                case 400:
                case 404:
                    console.log("Switching...");
                    break;
            }
        });
}

window.addEventListener('load', async function () {
    $(document).on('click', '#dns_register_button', App.register);

    await App.initWeb3();
	
	DNSContract.instance().domainConnector(web3.fromAscii('fadyaro'), function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
	});
});


