import copy from "rollup-plugin-copy";

export const sharedPlugins = [
  copy({
    targets: [
      { src: "manifest.json", dest: "dist" },
      { src: "blocked.html", dest: "dist" },
      { src: "blocked.js", dest: "dist" },
      { src: "icons", dest: "dist" },
      { src: "locales", dest: "dist" }
    ],
    hook: "writeBundle"
  })
];
