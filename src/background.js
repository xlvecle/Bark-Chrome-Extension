chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.sendRequest(tab.id, {
		method: "getSelection"
	}, function (response) {
		chrome.storage.sync.get({
			default_push_content: "clipboard"
		}, function (items) {
			//if default is URL, push URL
			if (items.default_push_content === "URL") {
				console.log(response);
				if (response != null && response.data != '') {
					var selectedText = response.data;
					console.log("send selected text: " + selectedText)
					sendMsg(response.data);
				} else {
					console.log("send url")
					sendUrl(tab);
				}
			} else if (items.default_push_content === "clipboard") {
				// if default is clipboard, push clipboard data
				sendClipboardData();
			}
		});
	});
});

//send selected text
function getword(info, tab) {
	console.log("menu " + info.menuItemId + " was clicked.");
	console.log("Word " + info.selectionText + " was clicked.");
	sendMsg(info.selectionText, info.menuItemId);
}

//send current page url
function sendUrl(tab) {
	chrome.tabs.query({
		'active': true,
		'lastFocusedWindow': true
	}, function (tabs) {
		var currentUrl = tabs[0].url;
		sendMsg(currentUrl);
		console.log(currentUrl);
	});
}

//send clipboard data
function sendClipboardData() {
	var result = '';
	var sandbox = document.getElementById('sandbox');
	sandbox.value = '';
	sandbox.select();
	if (document.execCommand('paste')) {
		result = sandbox.value;
	}
	sandbox.value = '';
	console.log("clipboard conetent: " + result);
	sendMsg(result);
}

function sendMsg(content, full_server_url = "") {
	chrome.storage.sync.get({
		server_urls: [],
		dataExtraParams: [],
	}, function (items) {
		if (items.server_urls === '' | items.server_urls.length === 0) {
			alert("please set server_url in options!");
			chrome.tabs.create({
				url: "options.html"
			});
			// chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
		} else {
			if (full_server_url === "") {
				full_server_url = items.server_urls[0].server_url;
			}
			console.log(full_server_url);
			let params = new URLSearchParams();
			params.append('automaticallyCopy', '1');
			if (items.dataExtraParams.url) {
				params.append('url', items.dataExtraParams.url);
			}
			if (items.dataExtraParams.copyCheck) {
				params.append('copy', content);
			}
			if (items.dataExtraParams.pushTitle && items.dataExtraParams.pushTitle.length > 0) {
				content = items.dataExtraParams.pushTitle;
			}
			let url = `${full_server_url}${encodeURIComponent(content)}?${params}`;
			console.log(url)
			httpGetAsync(url, function () {
				var notification = new Notification("Message Sent", {
					body: content,
					icon: "bark_128.png"
				});
			});
		};
	});
}

function httpGetAsync(theUrl, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);
}

function registerContextMenus() {
	chrome.storage.sync.get({
		server_urls: [],
	}, function (items) {
		console.log(items);
		chrome.contextMenus.removeAll(function() {
			console.log("items" + items[0]);
			for (const it of items.server_urls) {
				chrome.contextMenus.create({
					title: "Push To iPhone " + it.server_name,
					contexts: ["selection"],
					onclick: getword,
					id: it.server_url
				});
			}
		});
	});
}

registerContextMenus();

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting == "hello")
			registerContextMenus();
		sendResponse({
			farewell: "goodbye"
		});
	});