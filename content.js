function getActionItems() {
  return document.querySelector(".pagehead-actions");
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function createElementWithAttributes(type, attrs, namespace = SVG_NAMESPACE) {
	const element = document.createElementNS(namespace, type);
	Object.keys(attrs).forEach((key) => element.setAttribute(key, attrs[key]));
	return element;
}

function createSvgImage() {
	const paths = [
		{
			d: 'M29.01,5.03,23.244,2.254a1.742,1.742,0,0,0-1.989.338L2.38,19.8A1.166,1.166,0,0,0,2.3,21.447c.025.027.05.053.077.077l1.541,1.4a1.165,1.165,0,0,0,1.489.066L28.142,5.75A1.158,1.158,0,0,1,30,6.672V6.605A1.748,1.748,0,0,0,29.01,5.03Z',
			fill: '#0065a9',
		},
		{
			d: 'M29.01,26.97l-5.766,2.777a1.745,1.745,0,0,1-1.989-.338L2.38,12.2A1.166,1.166,0,0,1,2.3,10.553c.025-.027.05-.053.077-.077l1.541-1.4A1.165,1.165,0,0,1,5.41,9.01L28.142,26.25A1.158,1.158,0,0,0,30,25.328V25.4A1.749,1.749,0,0,1,29.01,26.97Z',
			fill: '#007acc',
		},
		{
			d: 'M23.244,29.747a1.745,1.745,0,0,1-1.989-.338A1.025,1.025,0,0,0,23,28.684V3.316a1.024,1.024,0,0,0-1.749-.724,1.744,1.744,0,0,1,1.989-.339l5.765,2.772A1.748,1.748,0,0,1,30,6.6V25.4a1.748,1.748,0,0,1-.991,1.576Z',
			fill: '#1f9cf0',
		},
	];

	const svgAttrs = {
		xmlns: SVG_NAMESPACE,
		height: '16',
		width: '16',
		viewBox: '0 0 32 32',
		class: 'octicon mr-1',
	};

	const svg = createElementWithAttributes('svg', svgAttrs);

	paths.forEach((pathAttrs) => svg.appendChild(createElementWithAttributes('path', pathAttrs)));

	return svg;
}

function createOpenInVsCodeItem() {
	const listItem = document.createElement('li');
	const vsCodeButton = createVsCodeButton();
	listItem.appendChild(vsCodeButton);
	return listItem;
}

function appendOpenVsCodeButton() {
	const actionItems = getActionItems();
	if (actionItems) {
		const openInVsCodeItem = createOpenInVsCodeItem();
		actionItems.appendChild(openInVsCodeItem);
	}
}

function getVsCodeLink(callback) {
	const url = window.location.href;
	const domains = ['github.com', 'gitlab.com', 'bitbucket.org', 'dev.azure.com'];

	for (const domain of domains) {
		const regex = new RegExp(`https://${domain}/(.*)`);
		const matches = url.match(regex);
		if (!matches) continue;

		chrome.storage.sync.get(
			{
				protocol: 'HTTPS',
				application: 'VS Code',
			},
			function (items) {
				const domainMatch = url.match(/https:\/\/([^/]+)\//);
				if (!domainMatch) return;
				const domain = domainMatch[1];

				const appProtocol =
					{
						'VS Code': 'vscode',
						'VS Code Insiders': 'vscode-insiders',
						VSCodium: 'vscodium',
						'VSCodium Insiders': 'vscodium-insiders',
					}[items.application] || 'vscode';

				const cloneUrl = `${items.protocol.toLowerCase()}://${domain}/${matches[1]}.git`;
				const vscodeUrl = `${appProtocol}://vscode.git/clone?url=${cloneUrl}`;
				callback(vscodeUrl);
			},
		);
	}
}
function createVsCodeButton() {
	const vsCodeButton = document.createElement('span');
	vsCodeButton.className = 'btn btn-sm';
	vsCodeButton.setAttribute('aria-label', 'Open repository in VS Code');
	vsCodeButton.appendChild(createSvgImage());
	const buttonTitle = document.createTextNode('Open in VS Code');
	vsCodeButton.appendChild(buttonTitle);

	getVsCodeLink((vscodeUrl) => {
		vsCodeButton.onclick = () => {
			window.open(vscodeUrl, '_blank');
		};
		vsCodeButton.title = vscodeUrl;
	});

	return vsCodeButton;
}

appendOpenVsCodeButton();