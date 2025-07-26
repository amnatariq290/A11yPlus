// Inject contrast styles if not already injected
if (!document.getElementById("a11y-contrast-style")) {
  const style = document.createElement('style');
  style.id = "a11y-contrast-style";
  style.textContent = `
    .a11y-contrast {
      background-color: black !important;
      color: yellow !important;
    }

    .a11y-contrast * {
      background-color: transparent !important;
      color: yellow !important;
    }
  `;
  document.head.appendChild(style);
}

// Toggle high contrast mode on message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggle-contrast") {
    document.body.classList.toggle("a11y-contrast");
  }

  if (message.type === "get-selection") {
    const selectedText = window.getSelection().toString();
    if (selectedText.trim().length > 0) {
      chrome.runtime.sendMessage({ type: "summarize", text: selectedText });
    } else {
      alert("Please select some text to summarize.");
    }
  }
});
