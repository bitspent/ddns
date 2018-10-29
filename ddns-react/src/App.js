import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import Web3 from 'web3';

class App extends Component {
    state = {
        domain_name_input: null,
        ddns_output: null,
        account: null,
        DNSContractInstance: null,
        DNSContractAddress: '0x74f169ca6d34fae11648b3334028ee4c8c4ab7e7',
        DNSContract_URL: 'https://gist.githubusercontent.com/toolazytobetrue/083ad42fb570817091f75d24aafe6b79/raw/e0943e6dfd2ac74fb8b68a215994d5ae70c359f9/DNSContract.json'
    };

    componentDidMount() {
        // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/plnAtKGtcoxBtY9UpS4b'));

        web3.eth.getAccounts().then(accounts => {
            this.setState({
                account: accounts[0],
                web3: web3
            });
        })
            .catch(err => {
                console.log(err);
            });

        axios.get(this.state['DNSContract_URL'])
            .then(result => {
                if (typeof result['data']['abi'] !== 'undefined') {
                    var DNSContract_ABI = result['data']['abi'];
                    let DNSContract = new web3.eth.Contract(DNSContract_ABI, this.state['DNSContractAddress']);
                    this.setState({
                        DNSContractInstance: DNSContract
                    });
                    console.log("Successfully loaded DDNS contract.");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let {domain_name_input, web3, DNSContractInstance} = this.state;
        let domain_name_input_bytes32 = web3.utils.fromAscii(domain_name_input);
        console.log("Submitted form.");
        // console.log(DNSContractInstance)
        // console.log( DNSContractInstance.methods.domainHtml(domain_name_input_bytes32));
        DNSContractInstance.methods.domainHtml(domain_name_input_bytes32).call().then(result => {

            let innerHtml = result[0] === `'` && result[result.length - 1] === `'` ? result.slice(1, result.length - 1) : result;

            this.setState({
                ddns_output: innerHtml,
                domain_name_input: domain_name_input
            });
        })
    };

    render() {
        let {ddns_output, domain_name_input} = this.state;

        function createMarkup() {
            return {__html: ddns_output};
        }

        let output = ddns_output === null ? (
            <p className="card-body left-align">Nothing to display</p>
        ) : (
            <div className="card-body left-align" dangerouslySetInnerHTML={createMarkup()}></div>
        );
        return (
            <div className="container">
                <div className="row" style={{paddingTop: '50px'}}>
                    <form className="col s12" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="input-field col" style={{marginTop: '27px'}}>
                                dns://
                            </div>
                            <div className="input-field col s4">
                                <input placeholder="enter domain name" id="domain_name_input" type="text"
                                       className="validate" onChange={this.handleChange}/>
                                <label htmlFor="domain_name_input">DNS Domain Navigation</label>
                            </div>
                            <div className="input-field col">
                                <button className="btn waves-effect waves-light right" type="submit"
                                        name="action">
                                    <i className="material-icons right">search</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row" id="ddns_output">
                    <div className="ticker card" key={domain_name_input}>
                        <div className="card-content">
                            <span className="card-title">{domain_name_input}</span>
                            {output}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
