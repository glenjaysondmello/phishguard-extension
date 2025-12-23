const params = new URLSearchParams(window.location.search);
const originalUrl = params.get("url");

document.getElementById("url-display").textContent = originalUrl;

const translations = {
  en: {
    title: "Unsafe Website Blocked",
    blockedLabel: "Blocked URL:",
    btnProceed: "Proceed Anyway",
    btnGoBack: "Go Back (Recommended)",
    warningInfo:
      "The page you are trying to access has been identified as malicious. It may trick you into installing software or revealing personal information.",
  },

  hi: {
    title: "असुरक्षित वेबसाइट अवरुद्ध",
    blockedLabel: "अवरुद्ध URL:",
    btnProceed: "फिर भी आगे बढ़ें",
    btnGoBack: "वापस जाएं (अनुशंसित)",
    warningInfo:
      "जिस पेज को आप खोलने की कोशिश कर रहे हैं, उसे हानिकारक पाया गया है। यह आपको सॉफ़्टवेयर इंस्टॉल कराने या व्यक्तिगत जानकारी साझा कराने के लिए धोखा दे सकता है।",
  },

  kn: {
    title: "ಸುರಕ್ಷಿತವಲ್ಲದ ವೆಬ್‌ಸೈಟ್ ತಡೆಗಟ್ಟಲಾಗಿದೆ",
    blockedLabel: "ತಡೆಗಟ್ಟಿದ URL:",
    btnProceed: "ಯಾವುದೇ ಹಾಗೆ ಮುಂದುವರಿಯಿರಿ",
    btnGoBack: "ಹಿಂದಕ್ಕೆ ಹೋಗಿ (ಶಿಫಾರಸು)",
    warningInfo:
      "ನೀವು ಪ್ರವೇಶಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತಿರುವ ಪುಟ ದುರುದ್ದೇಶಪೂರಿತವಾಗಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ. ಇದು ನಿಮ್ಮಿಂದ ಸಾಫ್ಟ್‌ವೇರ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿಸುವುದು ಅಥವಾ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ವಂಚಿಸಬಹುದು.",
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

const goBackBtn = document.getElementById("go-back-btn");
if (goBackBtn) {
  goBackBtn.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  });
}