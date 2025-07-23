function executeInActiveTab(func) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: func
    });
  });
}

document.getElementById("readText").addEventListener("click", () => {
  executeInActiveTab(() => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const utterance = new SpeechSynthesisUtterance(selectedText);
      speechSynthesis.speak(utterance);
    } else {
      alert("Please select some text to read.");
    }
  });
});

document.getElementById("contrastToggle").addEventListener("click", () => {
  executeInActiveTab(() => {
    document.body.classList.toggle("a11y-contrast");
  });
});

document.getElementById("increaseFont").addEventListener("click", () => {
  executeInActiveTab(() => {
    Array.from(document.querySelectorAll("*")).forEach(el => {
      const size = window.getComputedStyle(el).fontSize;
      const newSize = parseFloat(size) + 2;
      el.style.fontSize = newSize + "px";
    });
  });
});


document.getElementById("decreaseFont").addEventListener("click", () => {
  executeInActiveTab(() => {
    Array.from(document.querySelectorAll("*")).forEach(el => {
      const size = window.getComputedStyle(el).fontSize;
      const newSize = parseFloat(size) - 2;
      el.style.fontSize = newSize + "px";
    });
  });
});

