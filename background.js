function ext() {
  chrome.action.disable();

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    let rule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'github.com' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'gitlab.com' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'bitbucket.org' },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    let rules = [rule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
}

chrome.runtime.onStartup.addListener(() => {
  ext();
});

chrome.runtime.onInstalled.addListener(() => {
  ext();
});



chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
  chrome.storage.sync.get(
    {
      protocol: 'HTTPS',
      application: 'VS Code',
    },
    function (items) {
      console.log('Storage items:', items);
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        console.log('Active tab:', tabs[0]);
        const url = new URL(tabs[0].url);
        const path = url.pathname.split('/');
        let openApp = '';
        if (items.application == 'VS Code') {
          openApp = 'vscode';
        } else if (items.application == 'VS Code Insiders') {
          openApp = 'vscode-insiders';
        } else if (items.application == 'VSCodium') {
          openApp = 'vscodium';
        } else if (items.application == 'VSCodium Insiders') {
          openApp = 'vscodium-insiders';
        }
        console.log('Open app:', openApp);
        if (path[1] !== undefined && path[2] !== undefined) {
          let vscodeUrl = '';
          if (items.protocol == 'HTTPS') {
            vscodeUrl = openApp + '://vscode.git/clone?url=https://' + url.hostname + '/' + path[1] + '/' + path[2] + '.git';
            console.log('VS Code URL:', vscodeUrl);
          } else if (items.protocol == 'SSH') {
            vscodeUrl = openApp + '://vscode.git/clone?url=git@' + url.hostname + ':' + path[1] + '/' + path[2] + '.git';
            console.log('VS Code URL:', vscodeUrl);
          }
          // Pass the VS Code URL to the open.html page via a query parameter
          const newTabUrl = chrome.runtime.getURL('open.html') + `?url=${encodeURIComponent(vscodeUrl)}`;
          chrome.tabs.create({ url: newTabUrl });
        }
      });
    },
  );
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.vscodeUrl) {
    chrome.tabs.update({ url: request.vscodeUrl });
  }
});

// New listener for storage changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let key in changes) {
    let storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. Old value was "%s", new value is "%s".', key, namespace, storageChange.oldValue, storageChange.newValue);
  }
});




// let vscodeTabId = null;

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.vscodeUrl) {
//     chrome.tabs.create({ url: request.vscodeUrl }, (tab) => {
//       vscodeTabId = tab.id;
//     });
//   }
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (tabId === vscodeTabId && changeInfo.status === 'complete') {
//     chrome.tabs.remove(tabId);
//     vscodeTabId = null;
//   }
// });