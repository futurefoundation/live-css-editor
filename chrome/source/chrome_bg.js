function setItem(key, value) {
  try {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }catch(e) {

  }
}

function getItem(key) {
  var value;
  try {
    value = window.localStorage.getItem(key);
  }catch(e) {
    value = "false";
  }
  return value;
}

function clearStorage() {
  window.localStorage.clear();
}

function injectEditor() {

  if (typeof localStorage.warn === "undefined") {
    setItem('warn', 'true');
  }

  if (typeof localStorage.save === "undefined") {
    setItem('save', 'true');
  }

  if (typeof localStorage.keycode === "undefined") {
    setItem('keycode', 69);
  }

  chrome.tabs.executeScript(null, {file: "css_editor.min.js"});
  chrome.tabs.insertCSS(null, {file: "css_editor.css"});

  var warn = getItem('warn') === "true" ? true : false,
      save = getItem('save') === "true" ? true : false,
      code = "LiveCSSEditor({ warn : " + warn + ", save : " + save + " });";

  chrome.tabs.executeScript(null, {code: code});
}

function cleanupEditor() {
  chrome.tabs.executeScript(null, {file: "remove_editor.js"});
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.settings) {
      sendResponse({ setting : request.settings, value : getItem(request.settings) });
      return;
    }
    if (request.start) {
      injectEditor();
    }
    if (request.stop) {
      if (getItem('save') !== "true" && getItem('warn') === "true" && !confirm('Are you sure?')) {
        return;
      }
      cleanupEditor();
    }
    sendResponse({});
  }
);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  injectEditor();
});