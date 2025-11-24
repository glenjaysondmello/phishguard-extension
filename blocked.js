const params = new URLSearchParams(window.location.search);
const originalUrl = params.get("url");

document.getElementById("blocked-domain").textContent =
  `Blocked URL: ${originalUrl}`;

document.getElementById("allow-btn").addEventListener("click", () => {
  browser.runtime.sendMessage({
    type: "ALLOW_ONCE",
    url: originalUrl
  });
});
