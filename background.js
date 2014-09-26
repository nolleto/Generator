var dbHelper = new (function() {
	return {
		getUseMask: function() {
			var v = localStorage.getItem("mask");
			if (!v) {
				return false
			}
			return v == 'true';
		},
		setUseMask: function(v) {
			localStorage.setItem("mask", v);
		},
		getSaveOnClipboard: function() {
			var v = localStorage.getItem("copy");
			if (!v) {
				return false
			}
			return v == 'true';
		},
		setSaveOnClipboard: function(v) {
			localStorage.setItem("copy", v);	
		},
		getReplaceAll: function() {
			var v = localStorage.getItem("replace");
			if (!v) {
				return false
			}
			return v == 'true';
		},
		setReplaceAll: function(v) {
			localStorage.setItem("replace", v);	
		}
	};
});

function setValue(value) {
	if (dbHelper.getSaveOnClipboard()) {
		copyToClipboard(value);
	}
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { 
			value : value,
			replaceAll: dbHelper.getReplaceAll()
		}, function(response) {});
	});
}

function onClickHandler(info, tab) {
	 _gaq.push(['_trackEvent', 'clicked']);
	if (info.menuItemId == "cpf") {
		generateCpf();
	} else if (info.menuItemId == "cnpj") {
		generateCnpj();
	} else if (info.menuItemId == "useMask") {
		dbHelper.setUseMask(info.checked);		
	} else if (info.menuItemId == "clipboard") {
		dbHelper.setSaveOnClipboard(info.checked);
	} else if (info.menuItemId == "replace") {
		dbHelper.setReplaceAll(info.checked);
	}
};

chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(function() {
	var context = "editable",
		parentId = getRandom(100).toString();	

	chrome.contextMenus.removeAll(function() {
		chrome.contextMenus.create({"title": "Gerar...", "contexts":[context], "id": parentId});
		chrome.contextMenus.create({"title": "CPF", "contexts":[context], "id": "cpf", "parentId": parentId});
		chrome.contextMenus.create({"title": "CNPJ", "contexts":[context], "id": "cnpj", "parentId": parentId});
		chrome.contextMenus.create({"type":"separator", "parentId": parentId, "id": "separatorId", "contexts":[context]});
		chrome.contextMenus.create({"title": "Usar Máscara", "type": "checkbox", "contexts":[context], "id": "useMask", "parentId": parentId, "checked": dbHelper.getUseMask()});
		chrome.contextMenus.create({"title": "Copiar para Área de Transferência", "type": "checkbox", "contexts":[context], "id": "clipboard", "parentId": parentId, "checked": dbHelper.getSaveOnClipboard()});
		chrome.contextMenus.create({"title": "Subistituir todo conteúdo ao colar", "type": "checkbox", "contexts":[context], "id": "replace", "parentId": parentId, "checked": dbHelper.getReplaceAll()});
	});	
});

function copyToClipboard(value) {
	var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = value;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    console.log(document.execCommand("Copy", false, null));
    document.body.removeChild(copyDiv);
}

function generateCnpj(){
	var n = 9,
		n1 = getRandom(n),
		n2 = getRandom(n),
		n3 = getRandom(n),
		n4 = getRandom(n),
		n5 = getRandom(n),
		n6 = getRandom(n),
		n7 = getRandom(n),
		n8 = getRandom(n),
		n9 = 0,
		n10 = 0,
		n11 = 0,
		n12 = 1,
		d1 = 0,
		d2 = 0;

	d1 = n12*2+n11*3+n10*4+n9*5+n8*6+n7*7+n6*8+n5*9+n4*2+n3*3+n2*4+n1*5;
	d1 = 11 - ( mod(d1,11) );
	if (d1>=10) d1 = 0;
	
	d2 = d1*2+n12*3+n11*4+n10*5+n9*6+n8*7+n7*8+n6*9+n5*2+n4*3+n3*4+n2*5+n1*6;
	d2 = 11 - ( mod(d2,11) );
	if (d2>=10) d2 = 0;

	n1 = n1.toString();
	if (dbHelper.getUseMask()) {
		setValue(n1+n2+'.'+n3+n4+n5+'.'+n6+n7+n8+'/'+n9+n10+n11+n12+'-'+d1+d2);
	} else {
		setValue(n1+n2+n3+n4+n5+n6+n7+n8+n9+n10+n11+n12+d1+d2);
	}	
}

function generateCpf(){
	var n = 9;
		n1 = getRandom(n),
		n2 = getRandom(n),
		n3 = getRandom(n),
		n4 = getRandom(n),
		n5 = getRandom(n),
		n6 = getRandom(n),
		n7 = getRandom(n),
		n8 = getRandom(n),
		n9 = getRandom(n),
		d1 = 0,
		d2 = 0;

	d1 = n9*2+n8*3+n7*4+n6*5+n5*6+n4*7+n3*8+n2*9+n1*10;
	d1 = 11 - ( mod(d1,11) );
	if (d1>=10) d1 = 0;

	d2 = d1*2+n9*3+n8*4+n7*5+n6*6+n5*7+n4*8+n3*9+n2*10+n1*11;
	d2 = 11 - ( mod(d2,11) );
	if (d2>=10) d2 = 0;
		
	n1 = n1.toString();
	if (dbHelper.getUseMask()) {
		setValue(n1+n2+n3+'.'+n4+n5+n6+'.'+n7+n8+n9+'-'+d1+d2);
	} else {
		setValue(n1+n2+n3+n4+n5+n6+n7+n8+n9+d1+d2);
	}
}

function getRandom(n) {
	return Math.round(Math.random() * n);
} 

function mod(dividend, divisor) {
	return Math.round(dividend - (Math.floor(dividend/divisor)*divisor));
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-54984258-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js1';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();