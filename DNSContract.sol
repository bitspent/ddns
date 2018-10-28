pragma solidity ^0.4.20;

/**
 * 
 * @author Fady Aro 01-10-2018
 * 
 * DDNS Smart Contract
 *
 * A Decentralized Domain Name Server
 * 
 * Giving more meaning for the blockchain
 * 
 * Host Unstoppable Domains
 */
 
 contract usingDNSTools {

    /**
     * internal domain name validation
     *  
     * domain name contains only numbers, alphabets and '-' character
     * 
     * returns 0x0 on failure
     * 
     * returns lower case domain name on success
     */
    function validate(bytes32 name) internal pure returns (bytes32) {
        bytes32 arr;
        uint blank = 0;
        for(uint i = 0; i < 32; i++) {
            if(name[i] >= 65 && name[i] <= 90) {
                if(blank == 1) 
                    return 0x0;
                arr |= bytes32(bytes1(uint(name[i]) + 32) & 0xFF) >> (i * 8);
            } else if((name[i] >= 97 && name[i] <= 122) 
                || name[i] == 45
                || (name[i] >= 48 && name[i] <= 57)) {
                if(blank == 1) 
                    return 0x0;
                arr |= bytes32((name[i]) & 0xFF) >> (i * 8);
            } else if(name[i] == 32 || name[i] == 0x0) {
                blank = 1;
                arr |= bytes32(0x0 & 0xFF) >> (i * 8);
            } else {
                return 0x0;
            }
        }
        return arr;
    }
}

contract DNSContract is usingDNSTools {
    
    event DomainRegistered(address indexed holder, bytes32 indexed domain);
    
    event ConnectorChange(address indexed holder, bytes32 indexed domain);
    
    event RawHtmlChange(address indexed holder, bytes32 indexed domain);
    
    event DomainTransfer(address indexed _old, address indexed _new, bytes32 indexed domain);
    
    uint constant REGISTRATION_PRICE_WEI = 10**15;

    uint constant CONNECTOR_UP_PRICE_WEI = 20**15;
    
    uint constant RAW_HTML_UPD_PRICE_WEI = 20**15;

    struct record {
        
        address holder;
        
        string connector;
        
        string rawHtml;
        
    }
        
    address owner;
    
    mapping(bytes32 => record) sites;
    
    mapping(address => bytes32) transfers;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function register(bytes32 _domain, string _connector, string _rawHtml) public payable {
        
        bytes32 _site = validate(_domain);
        
        require
        (
            msg.value >= REGISTRATION_PRICE_WEI
            && _site != 0x00
            && sites[_site].holder == 0x00
        );
        
        sites[_site].holder = msg.sender;
        sites[_site].connector = _connector;
        sites[_site].rawHtml = _rawHtml;
        
        owner.transfer(msg.value);
        
        emit DomainRegistered(msg.sender, _site);
    }
    
    function changeConnector(bytes32 _site, string _connector) public payable {
        
        require
        (
            msg.value >= CONNECTOR_UP_PRICE_WEI
            && sites[_site].holder != 0x00
        );
        
        sites[_site].connector = _connector;
        
        emit ConnectorChange(msg.sender, _site);
    }
    
    function changeHtml(bytes32 _site, string _rawHtml) public payable {
        
        require
        (
            msg.value >= RAW_HTML_UPD_PRICE_WEI
            && sites[_site].holder != 0x00
        );
        
        sites[_site].rawHtml = _rawHtml;
        
        emit RawHtmlChange(msg.sender, _site);
    }
    
    function transferDomain(bytes32 _site, address _holder) public {
        
        require(sites[_site].holder == msg.sender);
        
        transfers[_holder] = _site;
    }
    
    function claimDomain(bytes32 _site) public payable {
        
        require
        (
            msg.value >= REGISTRATION_PRICE_WEI 
            && tx.origin == msg.sender
            && transfers[msg.sender] == _site
        );
        
        emit DomainTransfer(sites[_site].holder, msg.sender, _site);
        
        sites[_site].holder = msg.sender;
        
        delete transfers[msg.sender];
    }
    
    function domainHolder(bytes32 _site) public view returns (address) {
        return sites[_site].holder;
    }
    
    function domainHtml(bytes32 _domain) public view returns(string) {
        return sites[_domain].rawHtml;
    }
    
    function domainConnector(bytes32 _domain) public view returns(string) {
        return sites[_domain].connector;
    }
    
    function settle() public {
        require(owner == msg.sender);
        owner.transfer(address(this).balance);
    }
}
