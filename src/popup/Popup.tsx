import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Popup() {
  const { t, i18n } = useTranslation();
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    // get active tab URL
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs: any[]) => {
      const url = tabs?.[0]?.url || '';
      setCurrentUrl(url);
      if (url) {
        browser.runtime.sendMessage({ type: 'CHECK_URL', url }).then((resp: any) => {
          if (resp?.result) setScanResult(resp.result);
        });
      }
    });
  }, []);

  const reportUrl = () => {
    browser.runtime.sendMessage({ type: 'REPORT_URL', url: currentUrl }).then((resp: any) => {
      alert(t('reported'));
    });
  };

  return (
    <div style={{ width: 320, padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h3>{t('title')}</h3>
      <div style={{ fontSize: 13, marginBottom: 8, wordBreak: 'break-all' }}>{currentUrl}</div>
      {scanResult ? (
        <div>
          <div>{t('host')}: {scanResult.host}</div>
          <div>{t('blacklisted')}: {scanResult.isBlacklisted ? t('yes') : t('no')}</div>
          <div>{t('suspicious')}: {scanResult.isSuspicious ? t('yes') : t('no')}</div>
          <div>{t('confidence')}: {(scanResult.confidence * 100).toFixed(0)}%</div>
        </div>
      ) : (
        <div>{t('scanning')}</div>
      )}
      <div style={{ marginTop: 12 }}>
        <button onClick={reportUrl}>{t('report')}</button>
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
    </div>
  );
}