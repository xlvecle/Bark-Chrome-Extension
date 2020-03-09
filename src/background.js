let MAX_SYNC_DATA_SIZE = 500;

chrome.browserAction.onClicked.addListener(
	function (tab) {
		chrome.tabs.getAllInWindow(null, function(tabs){
			chrome.tabs.create({
				url: "options.html"
			});
			currentDatas = [];
		    for (var i = 0; i < tabs.length; i++) {
		    	if (!tabs[i].url.startsWith("chrome-extension://")) {
		    		chrome.tabs.remove(tabs[i].id);
		    		currentTime = new Date();

		    		currentData = new Object();
		    		currentData.timeStamp = currentTime.getTime();
		    		currentData.date = currentTime.toLocaleString();
		    		currentData.url = tabs[i].url;
		    		currentData.title = tabs[i].title;
		    		currentData.favIconUrl = tabs[i].favIconUrl;
		    		currentDatas.push(currentData);         
		    	}
		    }

		    if (currentDatas.length==0) {
		    	console.log("tmpty");
		    	return
		    }

		    chrome.storage.sync.get( {
		    	tabData: [],
		    }, function (data) {
		    	console.log(data.tabData);
		    	data.tabData.push(currentDatas);


		    	//Limited by the space of chrome sync storage, we have to put extra data locally
		    	if (data.tabData.length > MAX_SYNC_DATA_SIZE) {
		    		var shiftData = data.tabData.shift();

		    		chrome.storage.local.get( {
		    			tabData: [],
		    		}, function (local_data) {
		    			local_data.tabData.push(shiftData);
		    			chrome.storage.local.set({
		    			  tabData: local_data.tabData,
		    			});  
		    		}
		    		);

		    	}
		    	//save to chrome.storage
		    	chrome.storage.sync.set({
		    	  tabData: data.tabData,
		    	});   
		    }); 
		});
	}
);
