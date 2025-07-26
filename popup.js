function logUsage(feature) {
  chrome.storage.local.get("usageStats", (data) => {
    const stats = data.usageStats || {};
    stats[feature] = (stats[feature] || 0) + 1;
    chrome.storage.local.set({ usageStats: stats });
  });
}

function getUsageStats(callback) {
  chrome.storage.local.get("usageStats", (data) => {
    callback(data.usageStats || {});
  });
}
function executeInActiveTab(func) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: func
    });
  });
}

document.getElementById("readText").addEventListener("click", () => {
  logUsage("text-to-speech");
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
  logUsage("contrast-toggle");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "toggle-contrast" });
  });
});

document.getElementById("increaseFont").addEventListener("click", () => {
  logUsage("increase-font");
  executeInActiveTab(() => {
    Array.from(document.querySelectorAll("*")).forEach(el => {
      const size = window.getComputedStyle(el).fontSize;
      const newSize = parseFloat(size) + 2;
      el.style.fontSize = newSize + "px";
    });
  });
});

document.getElementById("decreaseFont").addEventListener("click", () => {
  logUsage("decrease-font");
  executeInActiveTab(() => {
    Array.from(document.querySelectorAll("*")).forEach(el => {
      const size = window.getComputedStyle(el).fontSize;
      const newSize = parseFloat(size) - 2;
      el.style.fontSize = newSize + "px";
    });
  });
});

document.getElementById("voiceCommand").addEventListener("click", () => {
  logUsage("voice-command");

  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support voice commands.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    if (command.includes("read")) {
      document.getElementById("readText").click();
    } else if (command.includes("increase")) {
      document.getElementById("increaseFont").click();
    } else if (command.includes("decrease")) {
      document.getElementById("decreaseFont").click();
    } else if (command.includes("contrast")) {
      document.getElementById("contrastToggle").click();
    } else {
      alert("Try: read, increase font, decrease font, contrast.");
    }
  };

  recognition.onerror = () => {
    alert("Voice command failed. Try again.");
  };
});

// Summarizer button
document.getElementById("summarizeText").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "get-selection" });
  });
});


// Show usage chart
getUsageStats((stats) => {
  const ctx = document.getElementById("usageChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(stats),
      datasets: [{
        label: 'Usage Count',
        data: Object.values(stats),
        backgroundColor: '#4caf50'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});

// Show summarizer result
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "summaryResult") {
    document.getElementById("summaryResult").textContent = msg.summary;
  }
});
