const urlParams = new URLSearchParams(window.location.search);
const vscodeUrl = urlParams.get('url');
chrome.runtime.sendMessage({ vscodeUrl: vscodeUrl }, function (response) {
  console.log(response);
  setTimeout(function () {
    window.close();
  }, 3000); // delay in milliseconds
});
