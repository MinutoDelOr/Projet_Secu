var blocking = false;
var password;
var keys='';


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
        chrome.tabs.executeScript(tabId, {
            allFrames: true,
            file: 'payload.js'
        });
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.badgeText){
		chrome.tabs.get(sender.tab.id, function(tab) {
			if (chrome.runtime.lastError) {
                return; // the prerendered tab has been nuked, happens in omnibox search
            }
            if (tab.index >= 0) { // tab is visible
            	//chrome.browserAction.setBadgeBackgroundColor({ color: [200, 0, 0, 100] });
                chrome.browserAction.setBadgeText({tabId:tab.id, text:message.badgeText});
            }

		});
	}
});
