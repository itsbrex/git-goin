function getActionItems() {
  return document.querySelector(".pagehead-actions");
}

function getIcon(application) {
  switch (application) {
    case "Cursor":
      return fetch(chrome.runtime.getURL("/icons/cursor.svg")).then(
        (response) => response.text(),
      );
    case "VS Code":
      return fetch(chrome.runtime.getURL("/icons/vscode.svg")).then(
        (response) => response.text(),
      );
    case "VS Code Insiders":
      return fetch(chrome.runtime.getURL("/icons/vscode-insiders.svg")).then(
        (response) => response.text(),
      );
    case "VSCodium":
      return fetch(chrome.runtime.getURL("/icons/vscodium.svg")).then(
        (response) => response.text(),
      );
    case "VSCodium Insiders":
      return fetch(chrome.runtime.getURL("/icons/vscodium-insiders.svg")).then(
        (response) => response.text(),
      );
    default:
      return Promise.resolve("");
  }
}

function createOpenInEditorItem(application) {
  const listItem = document.createElement("li");
  const editorButton = createEditorButton(application);
  listItem.appendChild(editorButton);
  return listItem;
}

function appendOpenEditorButton(application) {
  const actionItems = getActionItems();
  if (actionItems) {
    const openInEditorItem = createOpenInEditorItem(application);
    actionItems.appendChild(openInEditorItem);
  }
}

function getEditorLink(callback) {
  const url = window.location.href;
  const domains = [
    "github.com",
    "gitlab.com",
    "bitbucket.org",
    "dev.azure.com",
  ];

  for (const domain of domains) {
    const regex = new RegExp(`https://${domain}/(.*)`);
    const matches = url.match(regex);
    if (!matches) continue;

    chrome.storage.sync.get(
      {
        protocol: "HTTPS",
        application: "Cursor",
      },
      function (items) {
        const domainMatch = url.match(/https:\/\/([^/]+)\//);
        if (!domainMatch) return;
        const domain = domainMatch[1];

        const appProtocol =
          {
            Cursor: "cursor",
            "VS Code": "vscode",
            "VS Code Insiders": "vscode-insiders",
            VSCodium: "vscodium",
            "VSCodium Insiders": "vscodium-insiders",
          }[items.application] || "cursor";

        let cloneUrl = `${items.protocol.toLowerCase()}://${domain}/${
          matches[1]
        }`;
        if (matches[1].startsWith("tree/")) {
          cloneUrl = cloneUrl.replace(/tree\/[^/]+\//, "");
        }
        cloneUrl += ".git";
        const vscodeUrl = `${appProtocol}://vscode.git/clone?url=${cloneUrl}`;
        callback(vscodeUrl, items.application);
      },
    );
  }
}

function createEditorButton(application) {
  const editorButton = document.createElement("span");
  editorButton.className = "btn btn-sm";
  editorButton.setAttribute("aria-label", `Open repository in ${application}`);

  const buttonTitle = document.createElement("span");
  buttonTitle.textContent = `Open in ${application}`;
  buttonTitle.style.marginLeft = '5px';
  editorButton.style.display = 'flex';
  editorButton.style.flexDirection = 'row';
  editorButton.style.alignItems = 'center';

  getIcon(application).then((icon) => {
    const iconContainer = document.createElement("span");
    iconContainer.innerHTML = icon;
    iconContainer.firstChild.style.verticalAlign = 'middle';
    editorButton.appendChild(iconContainer);
    editorButton.appendChild(buttonTitle);
  });

  getEditorLink((vscodeUrl) => {
    editorButton.onclick = () => {
      window.open(vscodeUrl, '_blank');
    };
    editorButton.title = vscodeUrl;
  });

  return editorButton;
}

getEditorLink((vscodeUrl, application) => {
  appendOpenEditorButton(application);
});