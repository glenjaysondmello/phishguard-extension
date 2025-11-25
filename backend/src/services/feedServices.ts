import axios from "axios";
import csv from "csv-parser";
import { processStream } from "../process/processStream";
import { Readable } from "stream";

export const updatePhishTank = async () => {
  try {
    const url = "http://data.phishtank.com/data/online-valid.csv";

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        "User-Agent": "PhishGuard/1.0 (+https://phishguard.example.com)",
      },
    });

    const stream = response.data.pipe(csv());

    await processStream(
      stream,
      (row) => (row.url ? row.url.trim() : null),
      "PhishTank"
    );
  } catch (error) {
    console.error("[PhishTank] Error:", error);
  }
};

export const updateOpenPhish = async () => {
  try {
    const url = "https://openphish.com/feed.txt";
    const response = await axios.get(url, { responseType: "stream" });

    const stream = response.data;
    let buffer = "";

    const lineStream = new Readable({
      read() {},
      objectMode: true,
    });

    stream.on("data", (chunk: Buffer) => {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      lines.forEach((line) => lineStream.push({ url: line.trim() }));
    });

    stream.on("end", () => {
      if (buffer.length > 0) {
        lineStream.push({ url: buffer.trim() });
      }
      lineStream.push(null);
    });

    await processStream(
      lineStream,
      (row) => (row.url ? row.url : null),
      "OpenPhish"
    );
  } catch (error) {
    console.error("[OpenPhish] Error:", error);
  }
};

export const updateUrlHaus = async () => {
  try {
    const url = "https://urlhaus.abuse.ch/downloads/csv_recent/";
    const response = await axios.get(url, { responseType: "stream" });

    const stream = response.data.pipe(
      csv({
        skipComments: true,
        headers: [
          "id",
          "dateadded",
          "url",
          "url_status",
          "last_online",
          "threat",
          "tags",
          "urlhaus_link",
          "reporter",
        ],
      })
    );

    await processStream(
      stream,
      (row) => {
        return row.url ? row.url.trim() : null;
      },
      "URLhaus"
    );
  } catch (error) {
    console.error("[URLhaus] Error:", error);
  }
};
