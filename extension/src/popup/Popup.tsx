import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ShieldCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
const ShieldAlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);

export default function Popup() {
  const { t, i18n } = useTranslation();
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [userComment, setUserComment] = useState<string>("");

  useEffect(() => {
    // @ts-ignore - 'browser' might be undefined in standard React dev, fine for extensions
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs: any[]) => {
        const url = tabs?.[0]?.url || "";
        setCurrentUrl(url);
        if (url) {
          // @ts-ignore
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
      // @ts-ignore
      const [currentTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!currentTab || !currentTab.url) {
        alert(t("report_failure"));
        return;
      }

      // @ts-ignore
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
    localStorage.setItem("preferred-lang", e.target.value);
  };

 const isDangerous = scanResult && (scanResult.isBlacklisted || scanResult.isSuspicious);
  const themeColor = isDangerous ? "#d93025" : "#188038"; 
  const bgTheme = isDangerous ? "#fce8e6" : "#e6f4ea";

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h3 style={styles.title}>{t("title")}</h3>
        <select
          value={i18n.language}
          onChange={handleChange}
          style={styles.langSelect}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>
      </div>

      {/* URL DISPLAY */}
      <div style={styles.urlBar}>
        <GlobeIcon />
        <span style={styles.urlText}>{currentUrl || "..."}</span>
      </div>

      {/* MAIN STATUS CARD */}
      <div style={{ ...styles.statusCard, backgroundColor: scanResult ? bgTheme : "#f1f3f4" }}>
        {scanResult ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            
            <div style={{ ...styles.verdictRow, color: themeColor }}>
              {isDangerous ? <ShieldAlertIcon /> : <ShieldCheckIcon />}
              <span style={{ fontWeight: 700, fontSize: 16 }}>
                {isDangerous ? t("verdict_unsafe") : t("verdict_safe")}
              </span>
            </div>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>{t("host")}</span>
                <span style={styles.statValue}>{scanResult.host}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>{t("confidence")}</span>
                <span style={styles.statValue}>{(scanResult.confidence * 100).toFixed(0)}%</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>{t("blacklisted")}</span>
                <span style={{...styles.statValue, color: scanResult.isBlacklisted ? "#d93025" : "inherit"}}>
                  {scanResult.isBlacklisted ? t("yes") : t("no")}
                </span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>{t("suspicious")}</span>
                <span style={{...styles.statValue, color: scanResult.isSuspicious ? "#d93025" : "inherit"}}>
                  {scanResult.isSuspicious ? t("yes") : t("no")}
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <span>{t("scanning")}...</span>
          </div>
        )}
      </div>

      <hr style={styles.divider} />

      {/* REPORT FORM */}
      <div style={styles.reportSection}>
        <span style={styles.sectionTitle}>{t("report_page_title")}</span> 
        
        <textarea
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder={t("report_placeholder")} 
          style={styles.textarea}
        />
        <button onClick={reportUrl} style={styles.button}>
          {t("report")}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 420,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: "#ffffff",
    color: "#202124",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: "#202124",
  },
  langSelect: {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #dadce0",
    fontSize: "12px",
    color: "#5f6368",
    outline: "none",
    cursor: "pointer",
  },
  urlBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "16px",
    border: "1px solid #f1f3f4",
  },
  urlText: {
    fontSize: "12px",
    color: "#5f6368",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "'Roboto Mono', monospace",
  },
  statusCard: {
    padding: "16px",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  },
  verdictRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "8px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    color: "#5f6368",
    marginBottom: "2px",
    fontWeight: 600,
  },
  statValue: {
    fontSize: "13px",
    fontWeight: 500,
    wordBreak: "break-all",
  },
  loadingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px",
    color: "#5f6368",
    fontSize: "14px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #dadce0",
    borderTop: "2px solid #1a73e8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite", // inline keyframes are tricky in pure JS objects, usually requires CSS file
  },
  divider: {
    border: "0",
    borderTop: "1px solid #ebebeb",
    margin: "20px 0",
  },
  reportSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#202124",
  },
  textarea: {
    width: "100%",
    height: "70px",
    padding: "10px",
    border: "1px solid #dadce0",
    borderRadius: "6px",
    fontFamily: "inherit",
    fontSize: "13px",
    resize: "none",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};