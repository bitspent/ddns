onload = async () => {
    
	presenter.toast('Welcome to DDNS');

	/*
	 * get the active user
	 */
	let user = await DNSContract.getUser();
	presenter.showAddress(user);
	
	/*
	 * bind input - enter key
	 */
	let input = $$("input-domain");
	input.focus();
	input.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			$$("btn-check-domain").click();
		}
	});
	
	/*
	 * register domain action
	 */
	let registerDomain = async function() {
		presenter.toast('Awaiting your payment');
					console.log('parking domain');
					let domain = $('#input-domain').val();
					let domainHex = web3.fromAscii(domain);
					let connector = $('#connector-name').val();
					let rawHtml = $('#raw-html-text').val();				
					$('#modal-domain').modal('hide');
					await DNSContract.registerDomain(user, domainHex, connector, rawHtml);
	};
		
	/*
	 * check domain - bind
	 * if the domain is available show the register dialog
	 */ 
	$('#btn-check-domain').click(async function() {
		let domain = $('#input-domain').val();
		if(domain != '') {
			let domainHex = web3.fromAscii(domain);
			let holder = await DNSContract.checkDomain(domain);
			if(holder == 0 || holder == '0x'){
				presenter.toast('Domain Available');
				presenter.showRegisterDomainDialog(domain);
				$("#btn-park-domain").click(registerDomain);
			} else {
				presenter.toast('Domain Already Parked<br>Not Available');
			}
		} else {
			presenter.toast('Please Select A Valid Domain');
		}
	});	
	
	/*
	 * watch and sync user / users domains
	 */
	DNSContract.watchUserDomains(user, (result) => {
		presenter.showUserDomains(web3.toAscii(result['domain']));
	});
	
	DNSContract.watchUsersDomains((result, tx) => {
		presenter.showUsersDomains(tx, result['holder'], web3.toAscii(result['domain']));
	});
};
