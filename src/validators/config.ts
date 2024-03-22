import { z } from "zod";

const configSchema = z.object({
  http: z.object({
    enabled: z.boolean().default(false),
    port: z.number().nullable().default(null),
  }),
  bot: z.object({
    privateMessages: z.boolean().default(true),
    graph: z.boolean().default(true),
    disableLimits: z.boolean().default(false),
    textChannelMax: z.number().default(50),
    guildMax: z.number().default(100),
  }),
  youtube: z.object({
    api: z.enum(["data-api-v3", "innertube"]).default("data-api-v3"),
    delay: z.number().default(1000),
  }),
});

export type Config = z.infer<typeof configSchema>;

import config from "../../config";
import logger from "../logging";

console.log("Validating configuration...");

const parsed = configSchema.safeParse(config);
if (parsed.success === false) {
  console.error(
    "❌ Invalid configuration:",
    parsed.error.flatten().fieldErrors,
  );
  throw new SyntaxError("Invalid configuration");
}

console.log("Configuration seems to be correct...");
