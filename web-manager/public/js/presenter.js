/*
 * selector shortcut
 */
const $$ = (id) => {
    return document.getElementById(id);
};

/*
 * UI only - presenter
 */
const presenter = {

    /*
     * toast alert
     */
    toast: (msg, timeout) => {
        let toast = $$('snackbar');
        toast.className = "show";
        toast.innerHTML = msg;
        presenter.toastIndex = (presenter.toastIndex || 0) + 1;
        setTimeout(() => {
            if (--presenter.toastIndex === 0)
                toast.className = toast.className.replace("show", "");
        }, timeout || 2000);
    },
	
	
	/*
	 * show wallet address
	 * 0x6a44e36b9f66efab227b31a2128858bdcbbed3f5
	 */
	showAddress: (address) => {
		address = address + "";		
		let addr = address.substring(0, 8) + "..." + address.substring(36);
		let link = `<a style="color:white" target="_blank" href=https://ropsten.etherscan.io/address/${address}>${addr}</a>`;
		$('#label-address').html(`My Parked Domains on <b>${link}</b>`);
	},
	
	/*
	 * show recent user parked domains
	 */
	showUserDomains: (domain) => {
		domain = `<div class="list-group-item list-group-item-action">${domain}</div>`;
		$('#list-domains').append(domain);
	},
	
	/*
	 * show recent users parked address
	 */
	showUsersDomains: (tx, holder, domain) => {		
		let addr = tx.substring(0, 6) + "..." + tx.substring(60);
		let link = `<a style="font-family:monospace" target="_blank" href=https://ropsten.etherscan.io/tx/${tx}>${addr}</a>`;
		domain = `<div class="list-group-item list-group-item-action"><i>${link}</i>&nbsp; <b>${domain}</b></div>`;
		$('#list-latest-domains').append(domain);
	},
	
	/*
	 * load domains
	 */
	showRegisterDomainDialog: (domain) => {
		 
		$('#modal-domain')
			.modal()
			.find('.modal-title')
			.text(`Register Domain: ${domain}`);
			
		$$('connector-name').focus();
		$$('connector-name').addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode === 13) {
				document.getElementById("btn-park-domain").click();
			}
		});
			
		$$('raw-html-text').addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode === 13) {
				document.getElementById("btn-park-domain").click();
			}
		});
	}
};