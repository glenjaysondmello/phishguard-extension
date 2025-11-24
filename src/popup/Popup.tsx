import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Popup() {
  const { t, i18n } = useTranslation();
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [userComment, setUserComment] = useState<string>("");

  useEffect(() => {
    // get active tab URL
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs: any[]) => {
        const url = tabs?.[0]?.url || "";
        setCurrentUrl(url);
        if (url) {
          browser.runtime
            .sendMessage({ type: "CHECK_URL", url })
            .then((resp: any) => {
              if (resp?.result) setScanResult(resp.result);
            });
        }
      });
  }, []);

  const reportUrl = async () => {
    try {
      const [currentTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!currentTab || !currentTab.url) {
        alert(t("report_failure"));
        return;
      }

      const resp = await browser.runtime.sendMessage({
        type: "REPORT_URL",
        payload: {
          url: currentTab.url,
          pageTitle: currentTab.title || "",
          userComment,
          fromExtension: true,
        },
      });

      if (resp?.ok) {
        alert(t("report_success"));
      } else {
        alert(t("report_failure"));
      }
    } catch (error) {
      console.error("Error reporting URL:", error);
      alert(t("report_failure"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("i18nextLng", e.target.value);
  }

  return (
    <div
      style={{ width: 400, padding: 16, fontFamily: "system-ui, sans-serif" }}
    >
      <h3>{t("title")}</h3>
      <div style={{ fontSize: 13, marginBottom: 8, wordBreak: "break-all" }}>
        {currentUrl}
      </div>
      {scanResult ? (
        <div>
          <div>
            {t("host")}: {scanResult.host}
          </div>
          <div>
            {t("blacklisted")}: {scanResult.isBlacklisted ? t("yes") : t("no")}
          </div>
          <div>
            {t("suspicious")}: {scanResult.isSuspicious ? t("yes") : t("no")}
          </div>
          <div>
            {t("confidence")}: {(scanResult.confidence * 100).toFixed(0)}%
          </div>
        </div>
      ) : (
        <div>{t("scanning")}</div>
      )}

      <div style={{ marginBottom: 12 }}>
        <textarea
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder={t("report_placeholder")}
          style={{
            width: "calc(100% - 16px)", // Adjust for padding
            height: 60,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
            fontFamily: "inherit",
            fontSize: 14,
            resize: "none",
          }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={reportUrl}>{t("report")}</button>
        <select
          value={i18n.language}
          onChange={handleChange}
          style={{ marginLeft: 8 }}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="tulu">ತುಳು</option>
        </select>
      </div>
    </div>
  );
}
