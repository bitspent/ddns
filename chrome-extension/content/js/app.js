let App = {
    web3Provider: null,
    account: null,
    DNSContractInstance: null,
    DNSContractAddress: '0x748Bc9942b1b211056492D6DE7d6e14fE094B18A',
    DNSContract_URL: 'https://gist.githubusercontent.com/toolazytobetrue/083ad42fb570817091f75d24aafe6b79/raw/e0943e6dfd2ac74fb8b68a215994d5ae70c359f9/DNSContract.json',
    getAccount: function () {
        return new Promise((resolve, reject) => {
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(accounts[0]);
                }
            });
        });
    },

    initWeb3: async () => {
        return new Promise((resolve, reject) => {
            if (typeof web3 !== 'undefined') {
                App.web3Provider = web3.currentProvider;
            } else {
                App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
                return;
            }
            web3 = new Web3(App.web3Provider);
            if (web3 == null || typeof web3 === 'undefined') {
                return reject("Something went wrong");
            } else {
                return resolve("Successfully connected to Web3 Provider.");
            }
        });
    },

    initDNSContract: async () => {
        return new Promise((resolve, reject) => {
            $.getJSON(App.DNSContract_URL, function (data) {
                var DNSContract_ABI = data.abi;
                let DNSContract = web3.eth.contract(DNSContract_ABI);
                App.DNSContractInstance = DNSContract.at(App.DNSContractAddress);
                return resolve(true);
            });
        });
    },

    getBalance: function (address) {
        return new Promise((resolve, reject) => {
            web3.eth.getBalance(address, function (err, balance) {
                if (!err) {
                    return resolve(balance);
                } else {
                    return reject(err);
                }
            });
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
        App.DNSContractInstance.domainConnector(domain, {
            from: App.account
        }, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
    },

    getDomainHtml: function (domain) {
        App.DNSContractInstance.domainHtml(domain, {
            from: App.account
        }, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
    },

    load: async () => {
        App.account = await App.getAccount();
        let balance_eth = await App.getBalance(App.account);
        console.log(`${App.account}: ${balance_eth / 1e18} ETH`);
    }
};


window.addEventListener('load', async function () {
    $(document).on('click', '#dns_register_button', App.register);
    await App.initWeb3();
    await App.load();
    await App.initDNSContract();
});