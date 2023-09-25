function save_options() {
  var protocol = document.getElementById('protocol').value;
  var application = document.getElementById('application').value;

  var options = {
    protocol: protocol,
    application: application,
  };

  console.log('Saving options: ', options);

  chrome.storage.sync.set(options, function () {
    var status = document.getElementById('status');
    status.textContent = 'OPTIONS SAVED.';

    // Fetch and log the saved options to confirm they were saved
    chrome.storage.sync.get(['protocol', 'application'], function (items) {
      console.log('Saved options fetched: ', items);
    });

    setTimeout(function () {
      status.textContent = '';
    }, 3000);
  });
}

function restore_options() {
  chrome.storage.sync.get(
    {
      protocol: 'HTTPS',
      application: 'Cursor',
    },
    function (items) {
      console.log('Restored options:', items);
      document.getElementById('protocol').value = items.protocol;
      document.getElementById('application').value = items.application;
    },
  );
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
