// Save feature usage count
function logUsage(feature) {
  chrome.storage.local.get("usageStats", (data) => {
    const stats = data.usageStats || {};
    stats[feature] = (stats[feature] || 0) + 1;
    chrome.storage.local.set({ usageStats: stats });
  });
}

// Get usage stats for dashboard
function getUsageStats(callback) {
  chrome.storage.local.get("usageStats", (data) => {
    callback(data.usageStats || {});
  });
}
