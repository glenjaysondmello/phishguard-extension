// src/background.ts
// MV2 background script

const DEFAULT_BLACKLIST: string[] = [
  "example-phish.com",
  "bad-login.example",
  "google.com"
];

browser.runtime.onInstalled.addListener(async () => {
  console.log('PhishGuard background script installed');
  // Initialize storage
  await browser.storage.local.set({
    blacklist: DEFAULT_BLACKLIST,
    modelCached: false,
    prefs: { language: 'en', fallbackToServer: true }
  });
});

// Message handler from content scripts / popup
browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message?.type === 'CHECK_URL') {
    const url = message.url;
    handleCheckUrl(url).then(result => sendResponse({ ok: true, result })).catch(err => sendResponse({ ok: false, error: String(err) }));
    // required for async sendResponse
    return true;
  }

  if (message?.type === 'REPORT_URL') {
    // In Phase 1 we just store locally; later we POST to backend
    const reported = message.url;
    browser.storage.local.get(['reports']).then((res: any) => {
      const reports = res.reports || [];
      reports.push({ url: reported, ts: Date.now() });
      browser.storage.local.set({ reports });
    });
    sendResponse({ ok: true });
    return false; // Not async
  }
});

async function handleCheckUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    const { blacklist } = await browser.storage.local.get(['blacklist']);
    const list: string[] = blacklist || [];
    const isBlacklisted = list.some(domain => host.includes(domain));
    // placeholder heuristic: suspicious if URL has login + query params or punycode
    const isSuspicious = /login|signin|account/.test(url.pathname) && url.search.length > 0;
    // Later: call TF.js inference here
    return {
      host,
      isBlacklisted,
      isSuspicious,
      confidence: isBlacklisted ? 0.99 : isSuspicious ? 0.4 : 0.05
    };
  } catch (err) {
    return { error: 'invalid_url' };
  }
}