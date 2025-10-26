// src/contentScript.ts
// runs in page context (isolated world)

(function () {
  const url = location.href;
  // ask background to check the URL
  browser.runtime.sendMessage({ type: 'CHECK_URL', url }).then((response: any) => {
    if (response?.result) {
      const { isBlacklisted, isSuspicious } = response.result;
      if (isBlacklisted || isSuspicious) {
        // optionally display a small banner on page (simple, non-invasive)
        addPhishGuardBanner(isBlacklisted, isSuspicious);
      }
    }
  });

  function addPhishGuardBanner(isBlacklisted: boolean, isSuspicious: boolean) {
    const el = document.createElement('div');
    el.id = 'phishguard-banner';
    el.style.position = 'fixed';
    el.style.bottom = '12px';
    el.style.right = '12px';
    el.style.zIndex = '2147483647';
    el.style.padding = '8px 12px';
    el.style.borderRadius = '8px';
    el.style.background = isBlacklisted ? 'rgba(220, 40, 40, 0.95)' : 'rgba(255, 165, 0, 0.95)';
    el.style.color = '#fff';
    el.style.fontFamily = 'sans-serif';
    el.style.fontSize = '13px';
    el.textContent = isBlacklisted ? 'PhishGuard: Known malicious site' : 'PhishGuard: Suspicious page — click to check';
    el.onclick = () => {
      // open popup view (action) or open extension page for details
      browser.runtime.sendMessage({ type: 'OPEN_POPUP' });
    };
    document.body.appendChild(el);
    // auto remove after 12s to be non-intrusive
    setTimeout(() => el.remove(), 12000);
  }
})();