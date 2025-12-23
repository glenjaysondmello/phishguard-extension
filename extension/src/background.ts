import axios from "axios";

const API_BASE_URL = "https://phish-service.onrender.com";

const checkRemoteDatabase = async (fullUrl: string) => {
  try {
    if (
      fullUrl.includes("localhost") ||
      fullUrl.includes("127.0.0.1") ||
      fullUrl.startsWith("chrome-extension://") ||
      fullUrl.startsWith("moz-extension://") ||
      fullUrl.startsWith("about:")
    ) {
      return false;
    }

    const response = await axios.post(`${API_BASE_URL}/check-url`, {
      url: fullUrl,
    });

    return !response.data.safe;
  } catch (error) {
    console.error("API Check failed, failing open (allowing):", error);
    return false;
  }
};

const fetchAndCachedBlacklist = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/blacklist`);

    if (data && data.ok && Array.isArray(data.data)) {
      const domainList: string[] = data.data.map((item: any) => item.domain);

      await browser.storage.local.set({
        blacklist: domainList,
        blacklistLastUpdated: Date.now(),
      });

      console.log(
        `PhishGuard: Successfully cached ${domainList.length} domains.`
      );
    }
  } catch (error) {
    console.error("PhishGuard: Failed to fetch or cache blacklist:", error);
  }
};

browser.runtime.onInstalled.addListener(async () => {
  console.log("PhishGuard background script installed");
  // Initialize storage
  await browser.storage.local.set({
    modelCached: false,
    prefs: { language: "en", fallbackToServer: true },
    blacklist: [],
  });

  await fetchAndCachedBlacklist();

  browser.alarms.create("updateBlackAlarm", {
    periodInMinutes: 60,
  });
});

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateBlackAlarm") {
    console.log("PhishGuard: Periodic alarm triggered, updating blacklist...");
    fetchAndCachedBlacklist();
  }
});

const temporaryAllowList = new Map<string, number>();

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "ALLOW_ONCE") {
    const expiry = Date.now() + 10000; // 10 seconds from now

    const url = msg.url.replace(/\/$/, "");
    temporaryAllowList.set(url, expiry);
    console.log("PhishGuard: Temporarily allowing", msg.url);

    if (sender.tab && sender.tab.id) {
      browser.tabs.update(sender.tab.id, { url: msg.url });
    } else {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.update(tabs[0].id!, { url: msg.url });
      });
    }
  }
});

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const fullUrl = details.url;
    const normalizedUrl = fullUrl.replace(/\/$/, "");

    if (temporaryAllowList.has(normalizedUrl)) {
      const expiry = temporaryAllowList.get(normalizedUrl)!;
      if (Date.now() < expiry) {
        console.log("PhishGuard: URL is temporarily allowed:", fullUrl);
        return {};
      } else {
        temporaryAllowList.delete(fullUrl);
      }
    }

    if (details.type !== "main_frame" && details.type !== "sub_frame") {
      return {};
    }

    const { blacklist } = await browser.storage.local.get(["blacklist"]);
    const list: string[] = blacklist || [];

    const urlObj = new URL(fullUrl);
    const host = urlObj.hostname;

    const isBlacklisted = list.some(
      (domain) => host === domain || host.endsWith("." + domain)
    );

    if (isBlacklisted) {
      return {
        redirectUrl: browser.runtime.getURL(
          `blocked.html?url=${encodeURIComponent(fullUrl)}`
        ),
      };
    }

    if (details.type === "main_frame") {
      const isRemoteThreat = await checkRemoteDatabase(fullUrl);

      if (isRemoteThreat) {
        console.log("PhishGuard Block: Found in Global Threat Feed");
        return {
          redirectUrl: browser.runtime.getURL(
            `blocked.html?url=${encodeURIComponent(fullUrl)}&source=GlobalFeed`
          ),
        };
      }
    }

    return {};
  },
  {
    urls: ["<all_urls>"],
  },
  ["blocking"]
);

// Message handler from content scripts / popup
browser.runtime.onMessage.addListener(
  (message: any, sender: any, sendResponse: any) => {
    if (message?.type === "CHECK_URL") {
      const url = message.url;
      handleCheckUrl(url)
        .then((result) => sendResponse({ ok: true, result }))
        .catch((err) => sendResponse({ ok: false, error: String(err) }));
      // required for async sendResponse
      return true;
    }

    if (message?.type === "REPORT_URL") {
      // In Phase 1 we just store locally; later we POST to backend
      // const reported = message.url;
      const payload = message.payload;

      if (!payload || !payload.url) {
        sendResponse({ ok: false, error: "invalid_payload" });
        return false;
      }

      axios
        .post(`${API_BASE_URL}/report`, payload)
        .then((res) => {
          console.log("Report submitted:", res.data);
          sendResponse({ ok: true, data: res.data });
        })
        .catch((err) => {
          console.error("Error submitting report:", err);
          sendResponse({ ok: false, error: String(err) });
        });

      // browser.storage.local.get(["reports"]).then((res: any) => {
      //   const reports = res.reports || [];
      //   reports.push({ url: reported, ts: Date.now() });
      //   browser.storage.local.set({ reports });
      // });
      // sendResponse({ ok: true });

      return true; // async
    }
  }
);

async function handleCheckUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    const host = url.hostname;

    const { blacklist } = await browser.storage.local.get(["blacklist"]);
    const list: string[] = blacklist || [];
    // const isLocalBlacklisted = list.some((domain) => host.includes(domain));
    const isLocalBlacklisted = list.some(
      (domain) => host === domain || host.endsWith("." + domain)
    );

    const isRemoteBlacklisted = await checkRemoteDatabase(urlString);

    const isBlacklisted = isLocalBlacklisted || isRemoteBlacklisted;

    // placeholder heuristic: suspicious if URL has login + query params or punycode
    const isSuspicious =
      /login|signin|account/.test(url.pathname) && url.search.length > 0;
    // Later: call TF.js inference here
    return {
      host,
      isBlacklisted,
      isSuspicious,
      confidence: isBlacklisted ? 0.99 : isSuspicious ? 0.4 : 0.05,
    };
  } catch (err) {
    return { error: "invalid_url" };
  }
}
