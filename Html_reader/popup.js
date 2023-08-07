// This script runs when the popup is opened.

// Function to display the entire HTML content in the popup.
function displayHTML(html) {
  const outputElement = document.getElementById("output");
  outputElement.textContent = html;
}

// Send a message to the content script to get the HTML content.
function readDOM() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "get_page_html" });
  });
}

function readWordsFile() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "solve_wordle" });
  });
}

// Bind the readDOM function to the button click event.
document.getElementById("readDomButton").addEventListener("click", readWordsFile);
// document.getElementById("readDomButton").addEventListener("click", readDOM);
