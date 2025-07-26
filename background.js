chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "summarize") {
    const summary = await summarizeText(message.text);
    chrome.tabs.sendMessage(sender.tab.id, {
      type: "summaryResult",
      summary
    });
  }
});

async function summarizeText(inputText) {
  const apiKey = "hf_"; // Use your Hugging Face token
  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: inputText })
  });

  const result = await response.json();
  return result[0]?.summary_text || "Summary not available.";
}
