const params = new URLSearchParams(window.location.search);
const originalUrl = params.get("url");

document.getElementById("url-display").textContent = originalUrl;

const translations = {
  en: {
    title: "⚠️ Unsafe Website Blocked",
    blockedLabel: "Blocked URL:",
    btnProceed: "Proceed Anyway",
  },
  hi: {
    title: "⚠️ असुरक्षित वेबसाइट अवरुद्ध",
    blockedLabel: "अवरुद्ध URL:",
    btnProceed: "फिर भी आगे बढ़ें",
  },
  kn: {
    title: "⚠️ ಸುರಕ್ಷಿತವಲ್ಲದ ವೆಬ್‌ಸೈಟ್ ತಡೆಗಟ್ಟಲಾಗಿದೆ",
    blockedLabel: "ತಡೆಗಟ್ಟಿದ URL:",
    btnProceed: "ಯಾವುದೇ ಹಾಗೆ ಮುಂದುವರಿಯಿರಿ",
  },
  tulu: {
    title: "⚠️ ಭದ್ರತೆಡ್ದೆ ಕುಡೊರಿನ ವೆಬ್‌ಸೈಟ್ ಅಟ್ಪಾಯಿನಿ",
    blockedLabel: "ಅಟ್ಪಾಯಿನ URL:",
    btnProceed: "ಎನ್‌ಮೆ ಮುಂದು ಪೊರ್ಲೆ",
  },
};


function updateLanguage(lang) {
  const selectedData = translations[lang] || translations["en"];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (selectedData[key]) {
      element.textContent = selectedData[key];
    }
  });

  localStorage.setItem("preferred-lang", lang);
}

const langSelector = document.getElementById("language-selector");

langSelector.addEventListener("change", (e) => {
  updateLanguage(e.target.value);
});

const savedLang = localStorage.getItem("preferred-lang") || "en";
langSelector.value = savedLang;
updateLanguage(savedLang);

document.getElementById("allow-btn").addEventListener("click", () => {
  browser.runtime.sendMessage({
    type: "ALLOW_ONCE",
    url: originalUrl,
  });
});
