import { Threat } from "../models/Threat";
import { Readable } from "stream";

const BATCH_SIZE = 1000;

export const processStream = async (
  stream: Readable,
  transformFn: (row: any) => string | null,
  sourceName: string
) => {
  let bulkOPs: any[] = [];
  let count = 0;

  console.log(`[${sourceName}] Update started...`);

  for await (const row of stream) {
    const url = transformFn(row);
    if (!url) continue;

    bulkOPs.push({
      updateOne: {
        filter: { url: url },
        update: {
          $set: {
            url: url,
            source: sourceName,
            riskLevel: "High",
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    });

    if (bulkOPs.length >= BATCH_SIZE) {
      await Threat.bulkWrite(bulkOPs);
      count += bulkOPs.length;
      console.log(`[${sourceName}] Processed ${count} entries...`);
      bulkOPs = [];
    }
  }

  if (bulkOPs.length > 0) {
    await Threat.bulkWrite(bulkOPs);
    count += bulkOPs.length;
  }

  console.log(
    `[${sourceName}] Update completed. Total entries processed: ${count}`
  );
};
