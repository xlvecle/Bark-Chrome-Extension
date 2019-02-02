// chrome.browserAction.onClicked.addListener(sendUrl);
// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){
//   	console.log(response);
//     if (response != null && response.data != '') {
//     	var selectedText = response.data;
//     	console.log("send selected text: " + selectedText)
//     	sendMsg(response.data);
//     } else {
//     	console.log("send url")
//     	sendUrl(tab);
//     }
//   });
// });

chrome.storage.sync.get({
	server_urls: []}, function(items) {
		for (const it of items.server_urls) {
			chrome.contextMenus.create({
				title: "Push To iPhone " + it, 
				contexts:["selection"], 
				onclick: getword
			});
		}
	}
);

//send selected text
function getword(info, tab) {
  console.log("Word " + info.selectionText + " was clicked.");
  sendMsg(info.selectionText);
}

//send current page url
function sendUrl(tab) {
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    var currentUrl = tabs[0].url;
	    sendMsg(currentUrl);
	    console.log(currentUrl);
	});
}

function sendMsg(content){
	var full_server_url;
	chrome.storage.sync.get({
	  server_urls: []
	}, function(items) {
		if (items.server_urls === '' | items.server_urls.length === 0) {
			alert("please set server_url in options！");
			chrome.tabs.create({ url: "options.html" });
			// chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
		} else {
			full_server_url = items.server_urls[0];
			httpGetAsync(full_server_url + encodeURIComponent(content) + "?automaticallyCopy=1", function () {
				var notification = new Notification("Message Sent",
				 {body: content, icon: "bark_128.png"});
			});
		};
	});
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

